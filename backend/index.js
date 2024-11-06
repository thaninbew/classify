const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;
const env = require('dotenv').config();

app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:3001/callback';


app.get('/', (req, res) => {
    res.send('Welcome to the Classify Backend!');
  });
  
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
      }).toString()
  );
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const accessToken = response.data.access_token;
    // Redirect back to the frontend with the token
    res.redirect(`http://localhost:3000/?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error authenticating:', error);
    res.send('Authentication failed!');
  }
});

app.get('/playlists', async (req, res) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: accessToken,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching playlists:', error.response ? error.response.data : error);
    res.status(error.response?.status || 500).send('Failed to fetch playlists');
  }
});

app.get('/user-profile', async (req, res) => {
  const accessToken = req.headers['authorization'];

  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  try {
    // Fetch user profile
    const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: accessToken,
      },
    });
    const userProfile = userProfileResponse.data;

    // Fetch user's top artist
    const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=1', {
      headers: {
        Authorization: accessToken,
      },
    });
    const topArtist = topArtistsResponse.data.items[0];

    // Fetch user's top track
    const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=1', {
      headers: {
        Authorization: accessToken,
      },
    });
    const topTrack = topTracksResponse.data.items[0];

    // Send combined user information
    res.json({
      displayName: userProfile.display_name,
      email: userProfile.email,
      profilePicture: userProfile.images.length > 0 ? userProfile.images[0].url : null,
      coolFact: {
        topArtist: topArtist ? topArtist.name : 'No top artist data',
        topTrack: topTrack ? `${topTrack.name} by ${topTrack.artists[0].name}` : 'No top track data',
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error);
    res.status(error.response?.status || 500).send('Failed to fetch user profile');
  }
});

app.get('/refresh_token', async (req, res) => {
  const refreshToken = req.query.refresh_token;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error);
    res.status(500).send('Failed to refresh token');
  }
});

app.post('/cluster', async (req, res) => {
  const { features, n_clusters } = req.body;
  if (!features || !n_clusters) {
    return res.status(400).send('Missing features or number of clusters');
  }
  try {
    const response = await axios.post('http://localhost:5000/cluster', {
      features: features,  // Array of features from your frontend
      n_clusters: n_clusters  // Number of clusters from frontend
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching clustering results:', error.message);
    res.status(400).send('Failed to cluster songs');
  }
});

app.get('/features/:id', async (req, res) => {
  const accessToken = req.headers['authorization'];
  const trackId = req.params.id;

  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: accessToken,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching track features:', error.response ? error.response.data : error);
    res.status(error.response?.status || 500).send('Failed to fetch track features');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

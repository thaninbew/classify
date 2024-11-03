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
  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

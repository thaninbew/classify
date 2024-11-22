const axios = require('axios');

// Function to get Spotify access token
exports.getSpotifyToken = async (code, refreshToken) => {
  const body = refreshToken
    ? {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    : {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      };

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams(body),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Extract the access token explicitly
    const accessToken = response.data.access_token;

    // Optionally, return only the access token or the entire response
    return { accessToken, ...response.data };
  } catch (error) {
    console.error('Error fetching Spotify token:', error.response?.data || error.message);
    throw new Error('Failed to fetch Spotify token');
  }
};


// Function to fetch the current user's Spotify profile
exports.getSpotifyUserProfile = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: accessToken,
      },
      
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw new Error('Failed to fetch user profile');
  }
};

// Function to fetch playlists from the current user
exports.getSpotifyPlaylists = async (accessToken) => {

  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  // Remove 'Bearer ' prefix if present
  accessToken = accessToken.split(' ')[1];
  console.log('Cleaned Access Token:', accessToken);
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: {accessToken},
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error.message);
    throw new Error('Failed to fetch playlists');
  }
};

// Function to fetch tracks from a specific playlist
exports.getSpotifyPlaylistTracks = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: {accessToken},
      },
    });

    const tracks = response.data.items.map((item) => {
      if (item.track) {
        const track = item.track;
        return {
          id: track.id,
          name: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          album: track.album.name,
        };
      }
      return null;
    });

    return tracks.filter((track) => track !== null); // Remove null values
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.message);
    throw new Error('Failed to fetch playlist tracks');
  }
};

// Function to fetch audio features for a specific track
exports.getSpotifyTrackFeatures = async (accessToken, trackId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: {accessToken},
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching track features:', error.message);
    throw new Error('Failed to fetch track features');
  }
};

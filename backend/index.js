const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

const clientId = '0baf35c5a5a44675bb1a7a00bdc8f518';
const clientSecret = '2aa149c0819f4493a599876ebf15c437';
const redirectUri = 'http://localhost:3001/callback';

app.get('/', (req, res) => {
    res.send('Welcome to the Classify Backend!');
  });
  
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email playlist-read-private';
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
    res.send('Successfully authenticated!');
  } catch (error) {
    console.error('Error authenticating:', error);
    res.send('Authentication failed!');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

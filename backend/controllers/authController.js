const { getSpotifyToken } = require('../services/spotifyService');
const axios = require('axios');


exports.login = (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';
  const redirectUri = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri: process.env.REDIRECT_URI, 
  })}`;
  res.redirect(redirectUri);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  try {
    const { access_token, refresh_token } = await getSpotifyToken(code);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Error during authentication callback:', error.message);
    res.status(500).send('Authentication failed.');
  }
};



exports.refreshToken = async (req, res) => {
  const refreshToken = req.query.refresh_token;
  if (!refreshToken) {
    return res.status(400).send('Refresh token is missing');
  }

  try {
    const { accessToken, refresh_token } = await getSpotifyToken(null, refreshToken); // Handle both accessToken and refresh_token
    res.json({ access_token: accessToken, refresh_token });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).send('Failed to refresh token');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ success: true, message: 'Successfully logged out.' });
};

exports.validateAuth = async (req, res) => {
  const token = req.cookies.access_token;
  console.log('Cookies received in validateAuth:', req.cookies);

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Access token is missing or invalid.' });
  }

  try {
    await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json({ valid: true, token });
  } catch (error) {
    console.error('Token validation failed:', error.response?.data || error.message);
    res.status(401).json({ valid: false, error: 'Access token is invalid or expired.' });
  }
};





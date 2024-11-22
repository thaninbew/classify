const { getSpotifyToken } = require('../services/spotifyService');

exports.login = (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';
  const redirectUri = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri: process.env.REDIRECT_URI, // Ensure consistency with token exchange
  })}`;
  res.redirect(redirectUri);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  try {
    const { access_token, refresh_token } = await getSpotifyToken(code);
    
    // Redirect or return a success response
    res.redirect(`http://localhost:3000/?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Error during callback:', error.message);
    res.status(500).send('Authentication failed!');
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
  res.json({ success: true, message: 'Successfully logged out.' });
};


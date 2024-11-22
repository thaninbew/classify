const { getSpotifyToken } = require('../services/spotifyService');

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
    const accessToken = await getSpotifyToken(code);
    res.redirect(`http://localhost:3000/?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error during callback:', error.message);
    res.status(500).send('Authentication failed!');
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.query.refresh_token;
  try {
    const newToken = await getSpotifyToken(null, refreshToken);
    res.json({ access_token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    res.status(500).send('Failed to refresh token');
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Successfully logged out.' });
};

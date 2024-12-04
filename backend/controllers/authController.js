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
    const { access_token, refresh_token } = await getSpotifyToken(code);

    res.cookie('access_token', access_token, {
      httpOnly: true, //prevent access by JavaScript
      secure: process.env.NODE_ENV === 'production', //use secure cookies in production
      sameSite: 'Strict', //protect against CSRF
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
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
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ success: true, message: 'Successfully logged out.' });
};



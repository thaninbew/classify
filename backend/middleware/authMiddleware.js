const validateAccessToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing or invalid.' });
  }

  req.accessToken = token;
  next();
};

module.exports = validateAccessToken;
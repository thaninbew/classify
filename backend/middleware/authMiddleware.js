// middleware/authMiddleware.js
const validateAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Only valid bearer authentication supported' });
    }
  
    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(400).json({ error: 'Access token is missing' });
    }
  
    req.accessToken = token; // Attach clean token to the request object
    next();
  };
  
  module.exports = validateAccessToken;
  
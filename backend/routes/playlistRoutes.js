// routes/playlistRoutes.js
const express = require('express');
const {
  getPlaylists,
  getUserProfile,
  getPlaylistTracks,
  getTrackFeatures,
} = require('../controllers/playlistController');
const validateAccessToken = require('../middleware/authMiddleware');

const router = express.Router();

// Apply middleware to routes that need an access token
router.get('/', validateAccessToken, getPlaylists);
router.get('/user-profile', validateAccessToken, getUserProfile);
router.get('/:playlist_id/tracks', validateAccessToken, getPlaylistTracks);
router.get('/features/:id', validateAccessToken, getTrackFeatures);

module.exports = router;

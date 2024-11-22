const express = require('express');
const { getPlaylists, getUserProfile, getPlaylistTracks, getTrackFeatures } = require('../controllers/playlistController');

const router = express.Router();

router.get('/user-profile', getUserProfile);
router.get('/:playlist_id/tracks', getPlaylistTracks);
router.get('/features/:id', getTrackFeatures);
router.get('/', getPlaylists);

module.exports = router;

const express = require('express');
const { clusterPlaylistTracks } = require('../controllers/clusteringController');
const validateAccessToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/clusterPlaylistTracks', validateAccessToken, clusterPlaylistTracks);

module.exports = router;

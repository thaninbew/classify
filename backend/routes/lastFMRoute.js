const express = require('express');
const router = express.Router();
const lastFMController = require('../controllers/lastFMController');

router.get('/lastfm/tags', lastFMController.getTopTags);
router.post('/lastfm/match-and-visualize', lastFMController.matchAndVisualize);

module.exports = router;
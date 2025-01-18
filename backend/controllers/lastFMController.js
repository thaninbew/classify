const LastFMService = require('../services/LastFMService');
const clusteringController = require('./clusteringController');

exports.getTopTags = async (req, res) => {
  try {
    const { artist, track } = req.query;

    // Validate input
    if (!artist || !track) {
      return res.status(400).json({ error: 'Artist and track are required.' });
    }

    // Fetch tags from LastFMService
    const tags = await LastFMService.getTopTags(artist, track);

    // Return the response
    res.status(200).json({ tags });
  } catch (err) {
    console.error('Error fetching top tags:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch top tags.' });
  }
};

exports.matchAndVisualize = async (req, res) => {
  try {
    const { tracks } = req.body;
    if (!tracks || !Array.isArray(tracks)) {
      return res.status(400).json({ error: 'Tracks array is required.' });
    }

    const enrichedTracks = [];
    for (const track of tracks) {
      const tags = await LastFMService.getTopTags(track.artist, track.name);
      enrichedTracks.push({ ...track, tags });
    }

    const result = await clusteringController.matchAndVisualize(enrichedTracks);
    res.json(result);
  } catch (err) {
    console.error('Error in matchAndVisualize:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to process match-and-visualize request.' });
  }
};

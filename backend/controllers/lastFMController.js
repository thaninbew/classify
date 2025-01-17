const LastFMService = require('../services/LastFMService');

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

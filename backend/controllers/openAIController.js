const { generatePlaylistDescription } = require('../services/openAIService');

exports.generateDescription = async (req, res) => {
  const { genre, energy, valence } = req.body;

  if (!genre || energy === undefined || valence === undefined) {
    return res.status(400).json({ error: 'Genre, energy, and valence are required.' });
  }

  try {
    const description = await generatePlaylistDescription({ genre, energy, valence });
    res.json({ description });
  } catch (error) {
    console.error('Error generating description:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

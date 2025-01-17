const LastFMService = require('../services/LastFMService');

describe('LastFMService', () => {
  it('should fetch top tags for a given track', async () => {
    const artist = 'Bixby';
    const track = 'endlessly';

    try {
      const tags = await LastFMService.getTopTags(artist, track);
      expect(Array.isArray(tags)).toBe(true); // Check if tags is an array
      if (tags.length > 0) {
        expect(tags[0]).toHaveProperty('name'); // Ensure each tag has a 'name' property
      }
    } catch (err) {
      console.error('Error during API call:', err.response?.data || err.message);
      throw err; // Ensure the test fails on error
    }
  });
});

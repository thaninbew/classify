const axios = require('axios');

class LastFMService {
  static async getTopTags(artist, track) {
    const apiKey = process.env.LASTFM_API_KEY;
    const url = 'http://ws.audioscrobbler.com/2.0/';
    const params = {
      method: 'track.getTopTags',
      api_key: apiKey,
      artist: artist,
      track: track,
      format: 'json',
      autocorrect: 1
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.toptags.tag || [];
    } catch (err) {
      console.error('Failed to fetch top tags:', err.response?.data || err.message);
      throw err;
    }
  }
}

module.exports = LastFMService;

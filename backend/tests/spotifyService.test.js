const axios = require('axios');
const { getSpotifyMultipleTrackFeatures } = require('../services/spotifyService');

jest.mock('axios');

describe('getSpotifyMultipleTrackFeatures', () => {
  const accessToken = 'testAccessToken';
  const trackIds = ['track1', 'track2', 'track3'];

  it('should fetch audio features for multiple tracks successfully', async () => {
    const mockResponse = {
      data: {
        audio_features: [
          { id: 'track1', danceability: 0.8, energy: 0.7 },
          { id: 'track2', danceability: 0.6, energy: 0.8 },
          { id: 'track3', danceability: 0.9, energy: 0.6 },
        ],
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getSpotifyMultipleTrackFeatures(accessToken, trackIds);

    expect(result).toEqual(mockResponse.data.audio_features);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  });

  it('should handle 403 Forbidden error', async () => {
    const mockError = {
      response: {
        status: 403,
        data: { error: 'Forbidden' },
      },
    };

    axios.get.mockRejectedValue(mockError);

    await expect(getSpotifyMultipleTrackFeatures(accessToken, trackIds)).rejects.toThrow(
      'Failed to fetch multiple track features'
    );
  });

  it('should handle 429 Rate Limit Exceeded error', async () => {
    const mockError = {
      response: {
        status: 429,
        headers: { 'retry-after': '10' },
        data: { error: 'Rate limit exceeded' },
      },
    };

    axios.get.mockRejectedValue(mockError);

    await expect(getSpotifyMultipleTrackFeatures(accessToken, trackIds)).rejects.toThrow(
      'Failed to fetch multiple track features'
    );
  });

  it('should handle other errors', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { error: 'Internal Server Error' },
      },
    };

    axios.get.mockRejectedValue(mockError);

    await expect(getSpotifyMultipleTrackFeatures(accessToken, trackIds)).rejects.toThrow(
      'Failed to fetch multiple track features'
    );
  });
});

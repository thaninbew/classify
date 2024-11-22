const {
    getSpotifyPlaylists,
    getSpotifyUserProfile,
    getSpotifyPlaylistTracks,
    getSpotifyTrackFeatures,
  } = require('../services/spotifyService');
  
  exports.getPlaylists = async (req, res) => {
    try {
      const playlists = await getSpotifyPlaylists(req.accessToken); // Use token from middleware
      res.json(playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error.message);
      res.status(500).send('Failed to fetch playlists');
    }
  };
  
  exports.getUserProfile = async (req, res) => {
    try {
      const userProfile = await getSpotifyUserProfile(req.accessToken); // Use token from middleware
      res.json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      res.status(500).send('Failed to fetch user profile');
    }
  };
  
  exports.getPlaylistTracks = async (req, res) => {
    try {
      const tracks = await getSpotifyPlaylistTracks(req.accessToken, req.params.playlist_id); // Use token from middleware
      res.json(tracks);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error.message);
      res.status(500).send('Failed to fetch playlist tracks');
    }
  };
  
  exports.getTrackFeatures = async (req, res) => {
    try {
      const features = await getSpotifyTrackFeatures(req.accessToken, req.params.id); // Use token from middleware
      res.json(features);
    } catch (error) {
      console.error('Error fetching track features:', error.message);
      res.status(500).send('Failed to fetch track features');
    }
  };
  
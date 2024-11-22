// playlistController.js
const { getSpotifyPlaylists, getSpotifyUserProfile, getSpotifyPlaylistTracks, getSpotifyTrackFeatures } = require('../services/spotifyService');

exports.getPlaylists = async (req, res) => {
  const accessToken = req.headers['authorization'];
  console.log('Access Token:', accessToken);
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }
  try {
    const playlists = await getSpotifyPlaylists(accessToken);
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error.message);
    res.status(500).send('Failed to fetch playlists');
  }
};

exports.getUserProfile = async (req, res) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }
  try {
    const userProfile = await getSpotifyUserProfile(accessToken);
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).send('Failed to fetch user profile');
  }
};

exports.getPlaylistTracks = async (req, res) => {
  const accessToken = req.headers['authorization'];
  const playlistId = req.params.playlist_id;
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }
  try {
    const tracks = await getSpotifyPlaylistTracks(accessToken, playlistId);
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.message);
    res.status(500).send('Failed to fetch playlist tracks');
  }
};

exports.getTrackFeatures = async (req, res) => {
  const accessToken = req.headers['authorization'];
  const trackId = req.params.id;
  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }
  try {
    const features = await getSpotifyTrackFeatures(accessToken, trackId);
    res.json(features);
  } catch (error) {
    console.error('Error fetching track features:', error.message);
    res.status(500).send('Failed to fetch track features');
  }
};

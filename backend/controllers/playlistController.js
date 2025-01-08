const {
    getSpotifyPlaylists,
    getSpotifyUserProfile,
    getSpotifyPlaylistTracks,
    getSpotifyTrackFeatures,
    getSpotifyMultipleTrackFeatures,
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
      const userProfile = await getSpotifyUserProfile(req.accessToken);
      res.json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      res.status(500).send('Failed to fetch user profile');
    }
  };
  
  exports.getPlaylistTracks = async (req, res) => {
    try {
      const offset = parseInt(req.query.offset, 10) || 0; //default offset to 0
      const limit = parseInt(req.query.limit, 10) || 100; //default limit to 100
  
      //fetch playlist tracks with pagination
      const result = await getSpotifyPlaylistTracks(
        req.accessToken,
        req.params.playlist_id,
        offset,
        limit
      );
  
      if (req.query.withFeatures === 'true') {
        const trackIds = result.tracks.map(t => t.id);
        console.log('Access Token:', req.accessToken); // Log the access token
        const audioFeatures = await getSpotifyMultipleTrackFeatures(req.accessToken, trackIds);
        console.log('Audio Features:', audioFeatures); // Log the audio features
        result.tracks = result.tracks.map((track, i) => {
          const feats = audioFeatures[i] || {};
          return {
            ...track,
            features: {
              danceability: feats.danceability,
              energy: feats.energy,
              valence: feats.valence,
              tempo: feats.tempo,
              acousticness: feats.acousticness
            },
            genres: []
          };
        });
      }
  
      res.json(result); //send paginated response to the client
    } catch (error) {
      console.error('Error fetching playlist tracks:', error.message);
      res.status(500).send('Failed to fetch playlist tracks');
    }
  };
  
  exports.getTrackFeatures = async (req, res) => {
    try {
      const features = await getSpotifyTrackFeatures(req.accessToken, req.params.id); 
      res.json(features);
    } catch (error) {
      console.error('Error fetching track features:', error.message);
      res.status(500).send('Failed to fetch track features');
    }
  };

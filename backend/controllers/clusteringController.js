const axios = require('axios');

// Python server endpoint
const PYTHON_SERVER = 'http://localhost:5000';

exports.clusterPlaylistTracks = async (req, res) => {
    try {
        const { tracks, n_clusters = 5 } = req.body;
        
        if (!tracks || !Array.isArray(tracks)) {
            return res.status(400).json({ error: 'Tracks array is required' });
        }

        // Extract features and metadata from tracks
        const features = tracks.map(track => [
            track.features.danceability,
            track.features.energy,
            track.features.valence,
            track.features.tempo / 200, // Normalize tempo to 0-1 range
            track.features.acousticness
        ]);

        const track_metadata = tracks.map(track => ({
            name: track.name,
            artist: track.artists,
            genres: track.genres || []
        }));

        // Make request to Python clustering service
        const pythonResponse = await axios.post(`${PYTHON_SERVER}/cluster`, {
            features: features,
            track_metadata: track_metadata,
            n_clusters: n_clusters
        });

        res.json(pythonResponse.data);
    } catch (error) {
        console.error('Error in clustering:', error);
        if (error.response) {
            // Error response from Python server
            res.status(error.response.status).json({ 
                error: 'Clustering failed', 
                details: error.response.data 
            });
        } else if (error.code === 'ECONNREFUSED') {
            // Python server not running
            res.status(503).json({ 
                error: 'Clustering service unavailable', 
                details: 'Please ensure the Python server is running on port 5000' 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error',
                details: error.message 
            });
        }
    }
};

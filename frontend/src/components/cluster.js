import React, { useState } from 'react';
import axios from 'axios';

const Cluster = () => {
  const [numberOfPlaylists, setNumberOfPlaylists] = useState(5);
  const [clusterResult, setClusterResult] = useState(null);
  const [features] = useState([]);

  const createPlaylists = async () => {
    try {
      const response = await axios.post('http://localhost:3001/cluster', {
        features: features,
        n_clusters: numberOfPlaylists,
      });
      setClusterResult(response.data);
    } catch (error) {
      console.error('Error creating playlists:', error);
    }
  };

  return (
    <div className="clustering-section">
      <h2>Cluster Playlists</h2>
      <input
        type="number"
        value={numberOfPlaylists}
        onChange={(e) => setNumberOfPlaylists(e.target.value)}
        min="1"
        max="10"
      />
      <button onClick={createPlaylists}>Create Playlists</button>
      {clusterResult && (
        <div>
          <h3>Cluster Result:</h3>
          <pre>{JSON.stringify(clusterResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Cluster;

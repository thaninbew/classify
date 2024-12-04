import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistTracks = ({ playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('PlaylistTracks component mounted.');
    console.log(`Received playlistId: ${playlistId}`);

    const fetchTracks = async () => {
      const allTracks = [];
      const limit = 100;
      let offset = 0;
    
      try {
        const initialResponse = await axios.get(
          `http://localhost:3001/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
          { withCredentials: true }
        );
    
        console.log('Initial response:', initialResponse.data);
    
        allTracks.push(...initialResponse.data.tracks);
    
        const totalTracks = initialResponse.data.total;
        const totalBatches = Math.ceil(totalTracks / limit);

        for (let i = 1; i < totalBatches; i++) {
          offset = i * limit;
    
          const response = await axios.get(
            `http://localhost:3001/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
            { withCredentials: true }
          );
    
          console.log(`Batch ${i + 1} response:`, response.data);
    
          allTracks.push(...response.data.tracks);
        }
    
        setTracks(allTracks);
      } catch (error) {
        console.error('Failed to fetch tracks:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTracks();
  }, [playlistId]);

  if (loading) {
    console.log('Tracks are still loading...');
    return <div>Loading tracks...</div>;
  }

  console.log('Tracks loaded successfully:', tracks);

  return (
    <div>
      <button onClick={onBack}>Back to Playlists</button>
      <h2>Tracks in Playlist</h2>
      {tracks.length === 0 ? (
        <p>No tracks available for this playlist.</p>
      ) : (
        <ul>
          {tracks.map((track, index) => (
            <li key={track.id || index}>
              <strong>{track.name}</strong> by {track.artist || 'Unknown Artist'} - Album: {track.album || 'Unknown Album'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistTracks;

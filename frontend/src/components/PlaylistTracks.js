import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistTracks = ({ playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('PlaylistTracks component mounted.');
    console.log(`Received playlistId: ${playlistId}`);

    const fetchTracks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/playlists/${playlistId}/tracks`, {
          withCredentials: true,
        });

        console.log('Full response data:', response.data);

        // Directly set the tracks if the data is already an array
        if (Array.isArray(response.data)) {
          setTracks(response.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
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

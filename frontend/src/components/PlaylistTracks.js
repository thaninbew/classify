import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistTracks = ({ accessToken, playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTracks(response.data); // Expecting the data to be an array of tracks
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [accessToken, playlistId]);

  if (loading) return <div>Loading tracks...</div>;

  return (
    <div>
      <button onClick={onBack}>Back to Playlists</button>
      <h2>Tracks in Playlist</h2>
      <ul>
        {tracks.map((track, index) => (
          <li key={track.id}>
            <strong>{track.name}</strong> by {track.artist} - Album: {track.album}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistTracks;

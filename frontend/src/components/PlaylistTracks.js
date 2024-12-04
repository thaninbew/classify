import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlaylistTracks = ({ accessToken, playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const validateResponse = await axios.get('http://localhost:3001/auth/validate', {
          withCredentials: true,
        });

        if (validateResponse.data.valid) {
          const response = await axios.get(`http://localhost:3001/playlists/${playlistId}/tracks`, {
            withCredentials: true,
          });
          setTracks(response.data.items || []);
        } else {
          console.error('User is not authenticated.');
        }
      } catch (error) {
        console.error('Error during validation or fetching tracks:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId]);

  if (loading) return <div>Loading tracks...</div>;

  return (
    <div>
      <button onClick={onBack}>Back to Playlists</button>
      <h2>Tracks in Playlist</h2>
      <ul>
        {tracks.map((track, index) => (
          <li key={track.id}>
            <strong>{track.name}</strong> by {track.artists.map((artist) => artist.name).join(', ')} - Album: {track.album.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistTracks;

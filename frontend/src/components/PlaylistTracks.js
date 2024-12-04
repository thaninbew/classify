import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PlaylistTracks = ({ accessToken, playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        console.error('Access token missing');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTracks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching tracks:', error);
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

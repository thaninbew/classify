import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistCard from './playlistCard';
import './playlistCard.css';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Playlists component is rendered');

  useEffect(() => {
    const fetchPlaylists = async () => {
      console.log('fetchPlaylists function is called');
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setPlaylists(response.data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  return (
    <div className="playlists-container">
      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length > 0 ? (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            playlist?.id && (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
              />
            )
          ))}
        </div>
      ) : (
        <p>No playlists available. Please try again.</p>
      )}
    </div>
  );
};

export default Playlists;

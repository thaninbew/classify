import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistCard from './playlistCard';
import './playlistCard.css';

const Playlists = ({ accessToken, onSelect }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:3001/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPlaylists(response.data.items);
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
                onSelect={() => onSelect(playlist)} 
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

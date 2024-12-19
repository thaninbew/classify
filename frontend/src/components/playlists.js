import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistCard from './playlistCard';
import { useLoading } from '../LoadingContext';
import './playlistCard.css';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) return;
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setPlaylists(response.data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken, setIsLoading]);

  return (
    <div className="playlists-container">
      {playlists.length > 0 ? (
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

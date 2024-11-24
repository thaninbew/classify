import React, { useState } from 'react';
import axios from 'axios';
import PlaylistCard from './playlistCard';
import './playlistCard.css';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
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

  return (
    <div className="playlists-container">
      <header>
        <h1>Name's <span style={{ color: '#28a745', fontSize: '2rem' }}>PLAYLISTS</span></h1>
        <p>Select the playlist you want to classify</p>
      </header>
      <button onClick={fetchPlaylists} disabled={loading}>
        {loading ? 'Loading...' : 'Get Playlists'}
      </button>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onSelect={() => console.log(`Selected ${playlist.name}`)}
          />
        ))}
      </div>
      <footer className="footer">
        <a href="/about">ABOUT</a>
        <a href="/privacy">PRIVACY</a>
      </footer>
    </div>
  );
};

export default Playlists;

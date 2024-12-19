import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaylistTracks from '../components/PlaylistTracks';
import './Dashboard.css'; // Import the same CSS as Dashboard

const PlaylistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist;

  if (!playlist) {
    return <p>Invalid playlist. Please go back and select a valid playlist.</p>;
  }

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      <header>
        <button className="stats-button blink-on-hover" onClick={() => navigate('/dashboard')}>
          &#9665;
        </button>
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>
      </header>
      <PlaylistTracks playlistId={playlist.id} onBack={handleBack} />
      <footer>
        <div className="footer-links">
          <a href="/about">ABOUT</a>
          <a href="/privacy">PRIVACY</a>
        </div>
        <button className="logout-button blink-on-hover" onClick={() => navigate('/')}>
          LOGOUT
        </button>
      </footer>
    </div>
  );
};

export default PlaylistPage;

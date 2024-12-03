import React from 'react';
import Playlists from '../components/playlists';
import './Dashboard.css';

const Dashboard = ({ accessToken }) => {
  const handlePlaylistSelect = (playlist) => {
    console.log(`Selected playlist: ${playlist.name}`);
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Your Playlists</h1>
        <p>Browse and classify your playlists below.</p>
      </header>
      <Playlists accessToken={accessToken} onSelect={handlePlaylistSelect} />
      <footer>
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
      </footer>
    </div>
  );
};

export default Dashboard;

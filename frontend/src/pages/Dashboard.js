import React, { useEffect, useState } from 'react';
import Playlists from '../components/playlists';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, '/dashboard'); // Clean up URL
    } else {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  const handlePlaylistSelect = (playlist) => {
    console.log(`Selected playlist: ${playlist.name}`);
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Your Playlists</h1>
        <p>Browse and classify your playlists below.</p>
      </header>
      {!accessToken ? (
        <p>Loading... Please log in again if this persists.</p>
      ) : (
        <Playlists accessToken={accessToken} onSelect={handlePlaylistSelect} />
      )}
      <footer>
        <button onClick={logout}>Logout</button>
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
      </footer>
    </div>
  );
};

export default Dashboard;

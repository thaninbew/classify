import React, { useEffect, useState } from 'react';
import Playlists from '../components/playlists';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      navigate('/');
    } else {
      setAccessToken(token);
    }
  }, [navigate]);

  const handlePlaylistSelect = (playlist) => {
    console.log(`Selected playlist: ${playlist.name}`);
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    navigate('/');
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

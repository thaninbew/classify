import React, { useEffect, useState } from 'react';
import Playlists from '../components/playlists';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/validate', {
          withCredentials: true,
        });

        if (!response.data.valid) {
          navigate('/');
        } else {
          const token = response.data.token;
          if (token) setAccessToken(token);
        }
      } catch (error) {
        console.error('Authentication validation failed:', error.message);
      }
    };

    validateAuth();
  }, [navigate]);

  const handlePlaylistSelect = (playlist) => {
    console.log(`Selected playlist: ${playlist.name}`);
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:3001/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
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

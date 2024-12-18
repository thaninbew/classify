import React, { useEffect, useState } from 'react';
import Playlists from '../components/playlists';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

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
        <button className="stats-button" onClick={() => navigate('/statsPage')}>
          &#9665;
        </button>
        <h1>
          NAME's <span className="highlight-text">playlists</span>
        </h1>
        <p>select the playlist you want to classify</p>
      </header>

      {!accessToken ? (
        <p>Loading... Please log in again if this persists.</p>
      ) : (
        <Playlists accessToken={accessToken} onSelect={handlePlaylistSelect} />
      )}

      <footer>
        <div className="footer-links">
          <a href="/about">ABOUT</a>
          <a href="/privacy">PRIVACY</a>
        </div>
        <button className="logout-button" onClick={logout}>
          LOGOUT
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;

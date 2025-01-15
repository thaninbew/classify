import React, { useEffect, useState } from 'react';
import Playlists from '../components/playlists';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoading } from '../LoadingContext';
import Cookies from 'js-cookie';
import './Dashboard.css';
import Logout from '../components/Logout';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();
  const displayName = Cookies.get('displayName') || 'User';
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const validateAuth = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [navigate, setIsLoading]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.get('http://localhost:3001/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <button className="stats-button blink-on-hover" onClick={() => navigate('/statsPage')}>
        ◀
        </button>
        <h1>
          {displayName}'s <span className="highlight-text">playlists</span>
        </h1>
        <p>select the playlist you want to classify</p>
      </header>

      {accessToken ? (
        <Playlists accessToken={accessToken} />
      ) : null}

      <footer>
        <div className="footer-links">
          <a href="/about">ABOUT</a>
          <a href="/privacy">PRIVACY</a>
        </div>
        <Logout />
      </footer>
    </div>
  );
};

export default Dashboard;

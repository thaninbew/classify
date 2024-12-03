import React, { useEffect } from 'react';
import './Landing.css';
import Login from '../components/login';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>
          welcome to <span className="classify-highlight">classify,</span>
        </h1>
        <p>
          tired of having too many songs mixed together in one playlist? start generating custom playlists from your spotify using AI
        </p>
      </header>
      <div className="login-section">
        <Login />
        <div className="animation-placeholder"></div>
      </div>
      <footer className="landing-footer">
        <a href="/about">ABOUT</a>
        <a href="/privacy">PRIVACY</a>
      </footer>
    </div>
  );
};

export default Landing;

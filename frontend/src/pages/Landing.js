import React, { useEffect } from 'react';
import './Landing.css';
import Login from '../components/login';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
const validateAuth = async () => {
  try {
    const accessToken = document.cookie.includes('access_token'); // Check if cookies are available
    if (!accessToken) {
      console.log('No access token cookie found, skipping validation.');
      return;
    }

    const response = await axios.get('http://localhost:3001/auth/validate', {
      withCredentials: true,
    });

    if (response.data.valid) {
      navigate('/statsPage');
    }
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
};


    validateAuth();
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

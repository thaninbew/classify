import React from 'react';
import './Landing.css';
import Login from '../components/login';

const Landing = () => {
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

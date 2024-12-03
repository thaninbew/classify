import React, { useEffect, useState } from 'react';
import Login from '../components/login';
import Playlists from '../components/playlists';
import UserProfile from '../components/userProfile';
import axios from 'axios';
import './Landing.css';

const Landing = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const logout = async () => {
    await axios.get('http://localhost:3001/auth/logout');
    setAccessToken('');
    window.location.reload();
  };

  return (
    <div className="Landing">
      <h1>Welcome to</h1>
      <img src="/classify.png" alt="Cover Not Found" style={{ width: "500px", height: "150px", objectFit: "cover" }} />
      <p>Tired of having too many songs mixed together in one playlist? Start generating custom playlists from your Spotify using AI.</p>
      {!accessToken ? (
        <Login />
      ) : (
        <div className="login-button">
          <button onClick={logout}>Logout</button>
          <UserProfile accessToken={accessToken} />
          <Playlists accessToken={accessToken} />
        </div>
      )}
    </div>
  );
};

export default Landing;

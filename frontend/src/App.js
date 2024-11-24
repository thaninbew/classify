import React, { useEffect, useState } from 'react';
import Login from './login';
import Playlists from './playlists';
import UserProfile from './userProfile';
import axios from 'axios';
import './App.css';

const App = () => {
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
    try {
      await axios.get('http://localhost:3001/auth/logout');
      setAccessToken(''); 
      window.location.reload(); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="App">
      <h1>welcome to</h1>
      <img src="/classify.png" alt="Cover Not Found"  style={{ width: "500px", height: "150px", objectFit: "cover" }} />
      {!accessToken ? (
        <Login />
      ) : (
        <div className="loginbutton">
        <button onClick={logout}>Logout</button>
          <UserProfile accessToken={accessToken} />
          <Playlists accessToken={accessToken} />
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import Login from './login';
import Playlists from './playlists';
import UserProfile from './userProfile';
import axios from 'axios';

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
      await axios.get('http://localhost:3001/logout');
      setAccessToken(''); 
      window.location.reload(); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="App">
      <h1>Classify App</h1>
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <UserProfile accessToken={accessToken} />
          <Playlists accessToken={accessToken} />
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default App;

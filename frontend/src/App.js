import React, { useEffect, useState } from 'react';
import Login from './login';
import Playlists from './playlists';
import UserProfile from './userProfile';

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || '');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('access_token', token);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLogout = () => {
    setAccessToken('');
    localStorage.removeItem('access_token');
  };

  return (
    <div className="App">
      <h1>Classify App</h1>
      {/* Show login component if the user is not logged in */}
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <UserProfile accessToken={accessToken} />
          <Playlists accessToken={accessToken} />
        </>
      )}
    </div>
  );
};

export default App;

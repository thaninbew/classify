import React, { useEffect, useState } from 'react';
import Login from './login';
import Playlists from './playlists';

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

  return (
    <div className="App">
      <h1>Classify App</h1>
      {/* Show login component if the user is not logged in */}
      {!accessToken ? (
        <Login />
      ) : (
        // Show playlists component if the user is logged in
        <Playlists accessToken={accessToken} />
      )}
    </div>
  );
};

export default App;

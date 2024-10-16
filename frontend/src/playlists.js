import axios from 'axios';
import { useState } from 'react';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/playlists', {
        headers: {
          Authorization: accessToken,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchPlaylists}>Get Playlists</button>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlists;

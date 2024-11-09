import axios from 'axios';
import { useState } from 'react';
import PlaylistCard from './playlistCard';
import './playlistCard.css';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="playlists-container">
      <button onClick={fetchPlaylists} disabled={loading}>
        {loading ? 'Loading...' : 'Get Playlists'}
      </button>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onSelect={() => alert(`Selected playlist: ${playlist.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlists;
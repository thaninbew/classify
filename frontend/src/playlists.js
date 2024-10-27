import axios from 'axios';
import { useState } from 'react';
import './playlists.css'; 

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/playlists', {
        headers: {
          Authorization: accessToken,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
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
          <div key={playlist.id} className="playlist-card">
            <img
              src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={playlist.name}
              className="playlist-image"
            />
            <div className="playlist-info">
              <h3>{playlist.name}</h3>
              <p>{playlist.description || 'No description available'}</p>
              <button onClick={() => alert(`Selected playlist: ${playlist.name}`)}>
                Select Playlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;

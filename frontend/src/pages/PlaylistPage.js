import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaylistTracks from '../components/PlaylistTracks';

const PlaylistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist;

  if (!playlist) {
    return <p>Invalid playlist. Please go back and select a valid playlist.</p>;
  }

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="playlist-page-container">
      <header>
        <h1>{playlist.name}</h1>
        <p>{playlist.description || 'No description available'}</p>
      </header>
      <PlaylistTracks playlistId={playlist.id} onBack={handleBack} />
    </div>
  );
};

export default PlaylistPage;

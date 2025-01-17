import React from 'react';
import { useNavigate } from 'react-router-dom';
import './playlistCard.css';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    navigate('/classification', { state: { playlist } });
  };

  return (
    <div
      className="playlist-card"
      onClick={handleCardClick}
      role="button"
      tabIndex="0"
      aria-label={`Select playlist ${playlist.name}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      <img
        src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
        alt={`Cover of ${playlist.name}`}
        className="playlist-image"
      />
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
      </div>
      <button className="playlist-button" onClick={handleButtonClick}>
       ▶
      </button>
    </div>
  );
};

export default PlaylistCard;

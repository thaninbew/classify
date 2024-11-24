import React from 'react';
import './playlistCard.css';

const PlaylistCard = ({ playlist, onSelect }) => {
  return (
    <div
      className="playlist-card"
      onClick={onSelect}
      role="button"
      tabIndex="0"
      aria-label={`Select playlist ${playlist.name}`}
      keypress={(e) => {
        if (e.key === 'Enter') onSelect();
      }}
    >
      <img
        src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
        alt={`Cover of ${playlist.name}`}
        className="playlist-image"
      />
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <span>{playlist.tracks.total} tracks</span>
      </div>
    </div>
  );
};

export default PlaylistCard;

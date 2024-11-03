import React from 'react';
import './playlistCard.css';

const PlaylistCard = ({ playlist, onSelect }) => {
  return (
    <div className="playlist-card" onClick={onSelect}>
      <img
        src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
        alt={playlist.name}
        className="playlist-image"
      />
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <p>{playlist.description || 'No description available'}</p>
        <span>{playlist.tracks.total} tracks</span>
      </div>
    </div>
  );
};

export default PlaylistCard;
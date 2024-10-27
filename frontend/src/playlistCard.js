import React from 'react';

const PlaylistCard = ({ playlist, onSelect }) => {
  return (
    <div className="playlist-card" onClick={() => onSelect(playlist.id)}>
      <img src={playlist.imageUrl} alt={playlist.name} />
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <p>{playlist.description}</p>
        <span>{playlist.totalTracks} tracks</span>
      </div>
    </div>
  );
};

export default PlaylistCard;

import React from 'react';
import './TrackCard.css';

const TrackCard = ({ track }) => {
  return (
    <div className="track-card">
      <img
        src={track.albumArt || 'default-album.png'}
        alt={`${track.album} cover`}
        className="track-album-art"
      />
      <div className="track-details">
        <span className="track-name">{track.name}</span>
        <span className="track-artist">{track.artist || 'Unknown Artist'}</span>
        <span className="track-album">{track.album || 'Unknown Album'}</span>
      </div>
      <div className="track-duration">
        {track.duration || '0:00'}
      </div>
    </div>
  );
};

export default TrackCard;

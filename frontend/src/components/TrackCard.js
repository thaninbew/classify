import React from 'react';
import './TrackCard.css';

const TrackCard = ({ track }) => {
  // Format duration from milliseconds to mm:ss
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="track-card">
      <img
        src={track.images?.[0]?.url || 'default-album.png'}
        alt={`${track.album || 'Unknown Album'} cover`}
        className="track-album-art"
      />
      <div className="track-details">
        <span className="track-name">{track.name}</span>
        <span className="track-artist">{track.artist || 'Unknown Artist'}</span>
        <span className="track-album">{track.album || 'Unknown Album'}</span>
      </div>
      <div className="track-duration">
        {track.duration ? formatDuration(track.duration) : '0:00'}
      </div>
    </div>
  );
};

export default TrackCard;

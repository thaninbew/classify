import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackCard from './TrackCard';
import './PlaylistTracks.css';

const PlaylistTracks = ({ playlistId, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const allTracks = [];
      const limit = 100;
      let offset = 0;

      try {
        const initialResponse = await axios.get(
          `http://localhost:3001/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
          { withCredentials: true }
        );
        allTracks.push(...initialResponse.data.tracks);
        const totalTracks = initialResponse.data.total;
        const totalBatches = Math.ceil(totalTracks / limit);

        for (let i = 1; i < totalBatches; i++) {
          offset = i * limit;
          const response = await axios.get(
            `http://localhost:3001/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
            { withCredentials: true }
          );
          allTracks.push(...response.data.tracks);
        }

        setTracks(allTracks);
      } catch (error) {
        console.error('Failed to fetch tracks:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId]);

  if (loading) {
    return <div>Loading tracks...</div>;
  }

  return (
    <div className="playlist-tracks">
      {tracks.length === 0 ? (
        <p>No tracks available for this playlist.</p>
      ) : (
        <div className="tracks-container">
          {tracks.map((track, index) => (
            <TrackCard key={track.id || index} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistTracks;

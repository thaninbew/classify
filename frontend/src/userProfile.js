import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userProfile.css';  // Optional CSS file for styling

const UserProfile = ({ accessToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch user's profile data from Spotify API
        const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserProfile(userProfileResponse.data);

        // Fetch user's top artists
        const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=3', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTopArtists(topArtistsResponse.data.items);

        // Fetch user's top tracks
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=3', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTopTracks(topTracksResponse.data.items);
      } catch (error) {
        console.error('Error fetching user profile or top data:', error);
        setError('Failed to load user profile or top artists/tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="sidebar">
        <button id="back-btn">◀</button>
        <div className="top-artists">
          <h2>your top artists</h2>
          <div className="artist-info">
            <div className="artist-circle">
              <img
                src={topArtists.length > 0 ? topArtists[0].images[0].url : 'https://via.placeholder.com/50'}
                alt="Most Listened Artist"
                id="top-artist-picture"
                className="circle-image"
              />
            </div>
            <ol>
              {topArtists.map((artist, index) => (
                <li key={index}>{artist.name}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="top-tracks">
          <h2>your top tracks</h2>
          <div className="track-info">
            <div className="track-circle">
              <img
                src={topTracks.length > 0 ? topTracks[0].album.images[0].url : 'https://via.placeholder.com/50'}
                alt="Most Listened Track"
                id="top-track-picture"
                className="circle-image"
              />
            </div>
            <ol>
              {topTracks.map((track, index) => (
                <li key={index}>{track.name}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="go-button">
          <button id="go-btn">Let's Go ▶</button>
        </div>
      </div>
      <div className="main">
        <div className="header">
          <h1>Your All Time <span className="favorites">favorites</span></h1>
        </div>
        <div className="main-circle">
          <img
            src={userProfile?.images?.length > 0 ? userProfile.images[0].url : 'https://via.placeholder.com/300'}
            alt="Profile Picture"
            id="profile-picture"
            className="profile-circle"
          />
          <div className="user-name">
            <p>{userProfile?.display_name || 'NAME'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

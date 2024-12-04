import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userProfile.css';

const UserProfile = ({ accessToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/playlists/user-profile', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        setUserProfile(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err.message);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="sidebar">
          <div className="top-artists">
            <h2>Your Top Artist</h2>
            <div className="artist-info">
              <div className="artist-circle">
                <img
                  src={
                    userProfile.coolFact?.topArtist
                      ? userProfile.coolFact.topArtist.image
                      : 'https://via.placeholder.com/50'
                  }
                  alt="Top Artist"
                  className="circle-image"
                />
              </div>
              <p>{userProfile.coolFact?.topArtist || 'No data'}</p>
            </div>
          </div>
          <div className="top-tracks">
            <h2>Your Top Track</h2>
            <div className="track-info">
              <div className="track-circle">
                <img
                  src={
                    userProfile.coolFact?.topTrack
                      ? userProfile.coolFact.topTrack.image
                      : 'https://via.placeholder.com/50'
                  }
                  alt="Top Track"
                  className="circle-image"
                />
              </div>
              <p>{userProfile.coolFact?.topTrack || 'No data'}</p>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="header">
            <h1>Your All Time <span className="favorites">Favorites</span></h1>
          </div>
          <div className="main-circle">
            <img
              src={userProfile.profilePicture || 'https://via.placeholder.com/300'}
              alt="Profile"
              className="profile-circle"
            />
            <div className="user-name">
              <p>{userProfile.displayName || 'NAME'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

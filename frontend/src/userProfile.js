import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userProfile.css';  // Optional CSS file for styling

const UserProfile = ({ accessToken }) => {
  const [userProfile, setUserProfile] = useState(null);
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
        const response = await axios.get('http://localhost:3001/playlists/user-profile', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });          
        console.log('User Profile Data:', response.data);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
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
    <div className="user-profile">
      {userProfile && (
        <>
          <img
            src={userProfile.profilePicture || 'https://via.placeholder.com/150'}
            alt={`${userProfile.displayName}'s profile`}
            className="profile-picture"
          />
          <h2>{userProfile.displayName}</h2>
          <p>Email: {userProfile.email}</p>
          <div className="cool-fact">
            <h3>Cool Fact</h3>
            <p>Top Artist: {userProfile.coolFact.topArtist}</p>
            <p>Top Track: {userProfile.coolFact.topTrack}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;

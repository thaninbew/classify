import React, { useState, useEffect } from 'react';
import UserProfile from '../components/userProfile';
import './StatsPage.css';
import axios from 'axios';

const StatsPage = () => {
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateAuth = async () => {
      console.log('Validating authentication...');
      try {
        const response = await axios.get('http://localhost:3001/auth/validate', {
          withCredentials: true,
        });
        console.log('Validation response:', response.data);

        if (response.data.valid) {
          setAccessToken(response.data.token);
        } else {
          setError('Authentication failed. Please log in again.');
        }
      } catch (err) {
        console.error('Error validating authentication:', err.message);
        setError('Authentication failed. Please log in again.');
      }
    };

    validateAuth();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!accessToken) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stats-page">
      <UserProfile accessToken={accessToken} />
    </div>
  );
};

export default StatsPage;

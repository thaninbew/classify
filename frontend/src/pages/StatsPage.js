import React from 'react';
import UserProfile from '../components/userProfile';
import './StatsPage.css';

const StatsPage = ({ accessToken }) => {
  return (
    <div className="stats-page">
      <UserProfile accessToken={accessToken} />
    </div>
  );
};

export default StatsPage;

import React from 'react';
import { useLoading } from '../LoadingContext';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner">
          &#10038;
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

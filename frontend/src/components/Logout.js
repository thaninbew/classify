import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoading } from '../LoadingContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.get('http://localhost:3001/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button className="logout-button blink-on-hover" onClick={handleLogout}>
      LOGOUT
    </button>
  );
};

export default Logout;

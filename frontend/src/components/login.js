import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();

  const authenticateUser = async () => {
    try {
      window.location.href = 'http://localhost:3001/auth/login';
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div className="login-container">
      <button className="login-button" onClick={authenticateUser}>
        LOGIN
      </button>
    </div>
  );
};

export default Login;

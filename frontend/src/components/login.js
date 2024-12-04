import React from 'react';
import './login.css';

const Login = () => {
  const authenticateUser = () => {
    window.location.href = 'http://localhost:3001/auth/login';
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

const Login = () => {
  const authenticateUser = async () => {
    try {
      // This will call the backend endpoint that starts the Spotify login process
      window.location.href = 'http://localhost:3001/auth/login';
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div>
      <button onClick={authenticateUser}>Login with Spotify</button>
    </div>
  );
};

export default Login;

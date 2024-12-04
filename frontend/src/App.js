import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import './App.css';
import PlaylistPage from './pages/PlaylistPage';
import StatsPage from './pages/StatsPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          {/* Stats Page */}
          <Route path="/statsPage" element={<StatsPage />} />
          {/* Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* User Classify Page */}
          <Route path="/playlist/:id" element={<PlaylistPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

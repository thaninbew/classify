import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import './App.css';
import PlaylistPage from './pages/PlaylistPage';
import UserClassification from './pages/UserClassification';
import StatsPage from './pages/StatsPage';
import ScrollToTop from './components/ScrollToTop';
import { LoadingProvider } from './LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';

const App = () => {
  return (
    <LoadingProvider>
    <Router>
    <LoadingOverlay />
    <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          {/* Stats Page */}
          <Route path="/statsPage" element={<StatsPage />} />
          {/* Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Playlist Viewing Page */}
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          {/* User Classification Page */}
          <Route path="/classification" element={<UserClassification />} />
        </Routes>
      </div>
    </Router>
    </LoadingProvider>
  );
};

export default App;

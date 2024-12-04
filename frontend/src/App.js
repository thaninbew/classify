import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UserClassification from './pages/UserClassification';
import ClassificationResults from './pages/ClassificationResults';
import './App.css';
import PlaylistPage from './pages/PlaylistPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
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

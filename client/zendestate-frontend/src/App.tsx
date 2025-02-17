import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';  // Import the Navbar component
import TopNavbar from './components/navbar/TopNavbar';  // Import the TopNavbar component
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssistedDialerPage from './pages/AssistedDialer/AssistedDialer';
import NumberGeneratorPage from './pages/number_generator/NumberGenerator';
import OpportunitiesPage from './pages/opportunities/OpportunitiesPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        
        <div className="content-container">
          <Navbar /> 
          <TopNavbar /> Top Navbar
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect to dashboard if on root */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assistedDialer" element={<AssistedDialerPage />} />
            <Route path="/numberGenerator" element={<NumberGeneratorPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

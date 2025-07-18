import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import ScrapRates from './pages/ScrapRates';
import PickupHistory from './pages/PickupHistory';
import './App.css';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated on app load
    return authService.isAuthenticated();
  });
  
  React.useEffect(() => {
    // Set up authentication state listener
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    // Check auth status on mount
    checkAuth();
    
    // Optional: Set up periodic auth check
    const interval = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/booking" 
            element={isAuthenticated ? <BookingForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/scrap-rates" 
            element={isAuthenticated ? <ScrapRates /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pickups" 
            element={isAuthenticated ? <PickupHistory /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
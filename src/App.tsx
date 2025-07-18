import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import PickupHistory from './pages/PickupHistory';
import ScrapRates from './pages/ScrapRates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/history" element={<PickupHistory />} />
        <Route path="/rates" element={<ScrapRates />} />
      </Routes>
    </Router>
  );
}

export default App;

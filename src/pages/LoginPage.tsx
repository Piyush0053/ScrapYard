import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Facebook, Instagram, Twitter } from 'lucide-react';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      setError('Mobile number should contain only digits');
      return;
    }
    
      setLoading(true);
      
      const result = await authService.sendOTP(`+91${phone}`);
      
      if (result.success) {
        setSuccess(result.message);
        // Navigate after a short delay to show success message
        setTimeout(() => {
        navigate('/otp', { state: { phone: `+91${phone}` } });
        }, 1500);
      } else {
        setError(result.message);
      }
      
      setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div>
          <div className="logo">
            <Recycle size={32} />
            <span>Sustainify</span>
          </div>
          
          <div className="main-content">
            <h1>
              Sell your recyclables online with{' '}
              <span className="highlight">sustainify!</span>
            </h1>
            <p>
              Make a difference and earn money with Sustainify. Sell your
              recyclables online, hassle-free. Join the sustainable revolution
              now!
            </p>
            <div className="categories">
              Paper - Plastics - Metals - Appliances
            </div>
          </div>
        </div>

        <div>
          <div className="process-flow">
            <div className="process-step">
              <h3>Schedule</h3>
              <p>a Pickup</p>
            </div>
            <div className="arrow">→</div>
            <div className="process-step">
              <h3>Pickup at</h3>
              <p>your Address</p>
            </div>
            <div className="arrow">→</div>
            <div className="process-step">
              <h3>Receive</h3>
              <p>Payment</p>
            </div>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-link twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="illustration">
          Recycling Illustration
        </div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <h2>Schedule a Pickup ?</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mobile</label>
              <div className="phone-input">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  required
                  disabled={loading}
                />
              </div>
              {success && <div style={{ color: '#4CAF50', fontSize: '0.9rem', marginTop: '0.5rem' }}>{success}</div>}
              {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-large" disabled={loading || phone.length !== 10}>
              {loading ? 'Sending OTP...' : 'Book'}
            </button>
          </form>
          <div className="bottom-links">
            <span></span>
            <a href="#" className="link">Facing Issues? Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Facebook, Instagram, Twitter, ChevronLeft } from 'lucide-react';
import { authService } from '../services/authService';

interface OTPPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const OTPPage: React.FC<OTPPageProps> = ({ setIsAuthenticated }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const phone = location.state?.phone || '';
  
  // Timer countdown effect
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  // Redirect if no phone number
  React.useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    const result = await authService.sendOTP(phone);
    
    if (result.success) {
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.every(digit => digit !== '')) {
      setLoading(true);
      
      const otpString = otp.join('');
      const result = await authService.verifyOTP(phone, otpString);
      
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(result.message);
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      
      setLoading(false);
    } else {
      setError('Please enter the complete OTP');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <button className="back-button" onClick={handleBack}>
            <ChevronLeft size={24} />
          </button>
          
          <h2>Enter OTP</h2>
          
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            We've sent a 4-digit code to {phone}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  required
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            
            <div className="resend-text">
              {timer > 0 ? (
                <>No code? Resend after {formatTime(timer)}</>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#4CAF50', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: 'inherit'
                  }}
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            
            <button type="submit" className="btn btn-primary btn-large" disabled={loading || !otp.every(digit => digit !== '')}>
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </form>
          
          <div className="bottom-links">
            <span></span>
            <a href="#" className="contact-link">Facing Issues? Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Facebook, Instagram, Twitter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
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
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <a href="/scrap-rates" className="link">Scrap Rates</a>
          </div>
          
          <div className="dashboard-actions">
            <button 
              className="action-button"
              onClick={() => navigate('/booking')}
            >
              Schedule a Pickup
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/pickups')}
            >
              Check my Pickups
            </button>
          </div>
          
          <div className="bottom-links">
            <button onClick={handleLogout} className="link" style={{ background: 'none', border: 'none', fontSize: 'inherit' }}>
              Logout
            </button>
            <a href="#" className="link">Facing Issues? Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
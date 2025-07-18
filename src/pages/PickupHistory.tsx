import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ChevronLeft } from 'lucide-react';
import { pickupService, Pickup } from '../services/pickupService';

const PickupHistory: React.FC = () => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'cancelled' | 'completed'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    const result = await pickupService.getUserPickups();
    if (result.success && result.pickups) {
      setPickups(result.pickups);
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleScheduleAnother = () => {
    navigate('/booking');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'rgba(76, 175, 80, 0.1)';
      case 'cancelled':
        return 'rgba(244, 67, 54, 0.1)';
      case 'completed':
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(102, 102, 102, 0.1)';
    }
  };

  const filteredPickups = activeFilter === 'all' 
    ? pickups 
    : pickups.filter(pickup => pickup.status === activeFilter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div>
      <div className="header">
        <div className="logo">
          <Recycle size={24} />
          <span>Sustainify</span>
        </div>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Home</a>
          <a href="/scrap-rates" className="nav-link">Scrap Rates</a>
        </div>
      </div>

      <div className="right-section" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="form-container" style={{ minWidth: '800px', maxWidth: '1000px' }}>
          <button className="back-button" onClick={handleBack}>
            <ChevronLeft size={24} />
          </button>
          
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Pickups</h2>

          {/* Filter Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: activeFilter === 'all' ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All
            </button>
            <button
              className={`filter-btn ${activeFilter === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveFilter('scheduled')}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: activeFilter === 'scheduled' ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Scheduled
            </button>
            <button
              className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveFilter('cancelled')}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: activeFilter === 'cancelled' ? '#f44336' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancelled
            </button>
            <button
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: activeFilter === 'completed' ? '#2196F3' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Completed
            </button>
          </div>

          {/* Pickups List */}
          <div style={{ marginBottom: '2rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                Loading pickups...
              </div>
            ) : filteredPickups.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPickups.map((pickup) => (
                  <div
                    key={pickup.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h3 style={{ 
                          color: 'white', 
                          margin: '0 0 0.5rem 0',
                          fontSize: '1.1rem'
                        }}>
                          Pickup #{pickup.id.slice(-8)}
                        </h3>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          background: getStatusBgColor(pickup.status),
                          color: getStatusColor(pickup.status),
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {pickup.status}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', color: 'rgba(255, 255, 255, 0.8)' }}>
                        <div style={{ fontSize: '0.9rem' }}>
                          {formatDate(pickup.date)} at {formatTime(pickup.time)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem'
                    }}>
                      <div>
                        <strong>Address:</strong><br />
                        {pickup.address}
                      </div>
                      <div>
                        <strong>Scrap Type:</strong><br />
                        {pickup.scrap_types}
                      </div>
                      <div>
                        <strong>Estimated Weight:</strong><br />
                        {pickup.estimated_weight} kg
                      </div>
                      {pickup.remarks && (
                        <div>
                          <strong>Remarks:</strong><br />
                          {pickup.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.8)', 
                padding: '3rem',
                fontSize: '1.1rem'
              }}>
                {activeFilter === 'all' 
                  ? 'No pickups found. Schedule your first pickup!'
                  : `No ${activeFilter} pickups found.`
                }
              </div>
            )}
          </div>

          {/* Schedule Another Pickup Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="btn btn-primary"
              onClick={handleScheduleAnother}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem'
              }}
            >
              Schedule another Pickup
            </button>
          </div>
          
          <div className="bottom-links">
            <a href="/dashboard" className="link">Back to Dashboard</a>
            <a href="#" className="link">Facing Issues? Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupHistory;
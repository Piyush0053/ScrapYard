import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ChevronLeft } from 'lucide-react';
import { pickupService } from '../services/pickupService';
import { authService } from '../services/authService';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    address: '',
    scrapTypes: '',
    weight: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Update user profile if name/email provided
      if (formData.name || formData.email) {
        await authService.updateProfile({
          name: formData.name || undefined,
          email: formData.email || undefined
        });
      }

      // Create pickup
      const result = await pickupService.createPickup({
        date: formData.date,
        time: formData.time,
        address: formData.address,
        scrap_types: formData.scrapTypes,
        estimated_weight: Number(formData.weight),
        remarks: formData.remarks
      });

      if (result.success) {
        navigate('/pickups');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to schedule pickup');
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
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
        <div className="form-container" style={{ minWidth: '500px' }}>
          <button className="back-button" onClick={handleBack}>
            <ChevronLeft size={24} />
          </button>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Enter Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Enter Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Select an Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Select Scrap Types</label>
                <select
                  name="scrapTypes"
                  value={formData.scrapTypes}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select scrap type</option>
                  <option value="paper">Paper</option>
                  <option value="plastic">Plastic</option>
                  <option value="metal">Metal</option>
                  <option value="cardboard">Cardboard</option>
                  <option value="appliances">Appliances</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estimated Scrap Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Weight in kg"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Remarks (Optional)</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
              />
            </div>

            {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule a Pickup'}
            </button>
          </form>
          
          <div className="bottom-links">
            <a href="/pickups" className="link">Check My Pickups</a>
            <a href="#" className="link">Facing Issues? Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
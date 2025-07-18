import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Search } from 'lucide-react';
import { scrapRatesService, ScrapRate } from '../services/scrapRatesService';

const ScrapRates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rates, setRates] = useState<ScrapRate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    loadScrapRates();
  }, []);

  const loadScrapRates = async () => {
    const result = await scrapRatesService.getScrapRates();
    if (result.success && result.rates) {
      setRates(result.rates);
    }
    setLoading(false);
  };

  const filteredRates = rates.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </div>
      </div>

      <div className="right-section">
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div className="header" style={{ marginBottom: '2rem', background: 'transparent', padding: '0', justifyContent: 'flex-end' }}>
            <div className="nav-links">
              <a href="/dashboard" className="nav-link" style={{ color: '#2D5A50' }}>Home</a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2D5A50', margin: 0 }}>Scrap Item</h2>
            <h2 style={{ color: '#2D5A50', margin: 0 }}>Rates</h2>
          </div>

          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search an Item"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rates-table">
            {loading ? (
              <div className="rates-row">
                <span>Loading...</span>
                <span>-</span>
              </div>
            ) : filteredRates.length > 0 ? (
              filteredRates.map((item) => (
                <div key={item.id} className="rates-row">
                  <span>{item.item_name}</span>
                  <span>{item.rate_per_kg} Rs/kg</span>
                </div>
              ))
            ) : (
              <div className="rates-row">
                <span>No items found</span>
                <span>-</span>
              </div>
            )}
          </div>

          <div className="disclaimer">
            The Prices may vary with the Fluctuation in the Scrap Market.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapRates;
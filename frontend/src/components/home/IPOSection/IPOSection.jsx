import React from 'react';
import './IPOSection.css';

const IPOSection = ({ ipos }) => {
  return (
    <div className="ipo-section">
      <h2>Upcoming IPOs</h2>
      <div className="ipo-grid">
        {ipos.map((ipo, idx) => (
          <div key={idx} className="ipo-card">
            <h3>{ipo.company}</h3>
            <div className="ipo-details">
              <div className="ipo-row">
                <span>Price Range:</span>
                <strong>{ipo.priceRange}</strong>
              </div>
              <div className="ipo-row">
                <span>Open Date:</span>
                <strong>{ipo.openDate}</strong>
              </div>
              <div className="ipo-row">
                <span>Close Date:</span>
                <strong>{ipo.closeDate}</strong>
              </div>
              <div className="ipo-row">
                <span>Subscription:</span>
                <strong className={ipo.status === 'Open' ? 'positive' : ''}>{ipo.subscription}</strong>
              </div>
            </div>
            <span className={`ipo-status ${ipo.status.toLowerCase()}`}>{ipo.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IPOSection;

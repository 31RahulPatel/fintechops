import React from 'react';
import './MarketOverview.css';

const MarketOverview = ({ commodities, currencies, bonds }) => {
  return (
    <div className="market-overview">
      <div className="market-card">
        <h3>Commodities</h3>
        {commodities.map(item => (
          <div key={item.symbol} className="market-item">
            <span>{item.name}</span>
            <div>
              <div className="market-price">{item.price.toLocaleString()} {item.unit}</div>
              <div className={`market-change ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="market-card">
        <h3>Currencies</h3>
        {currencies.map(item => (
          <div key={item.symbol} className="market-item">
            <span>{item.name}</span>
            <div>
              <div className="market-price">₹{item.value}</div>
              <div className={`market-change ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="market-card">
        <h3>Bonds</h3>
        {bonds.map(item => (
          <div key={item.symbol} className="market-item">
            <span>{item.name}</span>
            <div>
              <div className="market-price">Yield: {item.yield}%</div>
              <div className={`market-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? '+' : ''}{item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;

import React from 'react';
import { FaLock } from 'react-icons/fa';
import './StocksSection.css';

const StocksSection = ({ stocks }) => {
  return (
    <div className="stocks-section">
      <h2 className="section-title">Market Stocks</h2>
      <div className="stock-grid">
        <div className="stock-list pro-stocks">
          <h3><FaLock /> Pro Stocks</h3>
          <div className="pro-blur">
            {stocks.proStocks?.slice(0, 3).map(stock => (
              <div key={stock.symbol} className="stock-item">
                <div>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div className="stock-price">₹{stock.price}</div>
              </div>
            ))}
          </div>
          <button className="premium-btn">Subscribe to Premium</button>
        </div>

        {['topInAction', 'topNifty50', 'topGainers', 'topLosers'].map(category => (
          <div key={category} className="stock-list">
            <h3>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
            {stocks[category]?.map(stock => (
              <div key={stock.symbol} className="stock-item">
                <div>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div>
                  <div className="stock-price">₹{stock.price}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="stock-list">
          <h3>Top Mutual Funds</h3>
          {stocks.topMutualFunds?.map((fund, idx) => (
            <div key={idx} className="stock-item">
              <div>
                <div className="stock-name">{fund.name}</div>
                <div className="fund-returns">1Y: {fund.returns1Y}%</div>
              </div>
              <div>
                <div className="stock-price">₹{fund.nav}</div>
                <div className={`stock-change ${fund.change >= 0 ? 'positive' : 'negative'}`}>
                  {fund.change >= 0 ? '+' : ''}{fund.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StocksSection;

import React from 'react';
import StockSearch from '../../components/Stocks/StockSearch';
import './Stocks.css';

const Stocks = () => {
  return (
    <div className="stocks-page">
      <div className="stocks-header">
        <h1>Stock Market</h1>
        <p>Search and track Indian stocks in real-time</p>
      </div>
      
      <div className="search-section">
        <StockSearch />
      </div>

      <div className="quick-links">
        <h2>Popular Stocks</h2>
        <div className="stock-chips">
          <a href="/stocks/RELIANCE.NS" className="stock-chip">Reliance</a>
          <a href="/stocks/TCS.NS" className="stock-chip">TCS</a>
          <a href="/stocks/INFY.NS" className="stock-chip">Infosys</a>
          <a href="/stocks/HDFCBANK.NS" className="stock-chip">HDFC Bank</a>
          <a href="/stocks/ICICIBANK.NS" className="stock-chip">ICICI Bank</a>
          <a href="/stocks/WIPRO.NS" className="stock-chip">Wipro</a>
        </div>
      </div>
    </div>
  );
};

export default Stocks;

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StockSearch from '../../components/Stocks/StockSearch';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWatchlist();
    const interval = setInterval(refreshPrices, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadWatchlist = () => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      const symbols = JSON.parse(saved);
      fetchStockData(symbols);
    } else {
      setLoading(false);
    }
  };

  const fetchStockData = async (symbols) => {
    setLoading(true);
    const promises = symbols.map(symbol =>
      axios.get(`${process.env.REACT_APP_MARKET_API_URL}/quote/${symbol}`)
        .then(res => res.data.data)
        .catch(() => null)
    );
    const results = await Promise.all(promises);
    setWatchlist(results.filter(r => r !== null));
    setLoading(false);
  };

  const refreshPrices = () => {
    const symbols = watchlist.map(s => s.symbol);
    if (symbols.length > 0) {
      fetchStockData(symbols);
    }
  };

  const addToWatchlist = (symbol) => {
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!saved.includes(symbol)) {
      saved.push(symbol);
      localStorage.setItem('watchlist', JSON.stringify(saved));
      loadWatchlist();
    }
    setShowSearch(false);
  };

  const removeFromWatchlist = (symbol) => {
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const updated = saved.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    setWatchlist(watchlist.filter(s => s.symbol !== symbol));
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div>
          <h1><FaStar /> My Watchlist</h1>
          <p>{watchlist.length} stocks tracked</p>
        </div>
        <button className="add-stock-btn" onClick={() => setShowSearch(!showSearch)}>
          <FaPlus /> Add Stock
        </button>
      </div>

      {showSearch && (
        <div className="search-overlay">
          <div className="search-modal">
            <h3>Add Stock to Watchlist</h3>
            <StockSearch onSelect={addToWatchlist} />
            <button className="close-search" onClick={() => setShowSearch(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="watchlist-loading">Loading watchlist...</div>
      ) : watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <FaStar size={64} color="#ddd" />
          <h2>Your watchlist is empty</h2>
          <p>Add stocks to track their performance</p>
          <button className="add-stock-btn" onClick={() => setShowSearch(true)}>
            <FaPlus /> Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(stock => (
            <div key={stock.symbol} className="watchlist-card" onClick={() => navigate(`/stocks/${stock.symbol}`)}>
              <div className="card-header">
                <div>
                  <h3>{stock.symbol}</h3>
                  <p className="stock-name">{stock.symbol.replace('.NS', '')}</p>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={(e) => { e.stopPropagation(); removeFromWatchlist(stock.symbol); }}
                >
                  <FaTrash />
                </button>
              </div>
              <div className="card-price">
                <div className="price">₹{stock.price.toFixed(2)}</div>
                <div className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                </div>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span>Open</span>
                  <strong>₹{stock.open.toFixed(2)}</strong>
                </div>
                <div className="stat">
                  <span>High</span>
                  <strong>₹{stock.high.toFixed(2)}</strong>
                </div>
                <div className="stat">
                  <span>Low</span>
                  <strong>₹{stock.low.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;

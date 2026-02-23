import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StockSearch.css';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_MARKET_API_URL}/search`, {
          params: { q: query }
        });
        setResults(response.data.data || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol) => {
    navigate(`/stocks/${symbol}`);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="stock-search" ref={searchRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search stocks (e.g., RELIANCE, TCS, INFY)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <FaTimes className="clear-icon" onClick={() => { setQuery(''); setResults([]); }} />
        )}
      </div>

      {showResults && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((stock, index) => (
              <div key={index} className="search-result-item" onClick={() => handleSelect(stock.symbol)}>
                <div className="result-symbol">{stock.symbol}</div>
                <div className="result-name">{stock.name}</div>
                <div className="result-meta">{stock.region} • {stock.type}</div>
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className="search-empty">No stocks found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default StockSearch;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import './StockDetail.css';

const StockDetail = () => {
  const { symbol } = useParams();
  const [quote, setQuote] = useState(null);
  const [company, setCompany] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockData();
  }, [symbol, timeframe]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const [quoteRes, companyRes, historyRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_MARKET_API_URL}/quote/${symbol}`),
        axios.get(`${process.env.REACT_APP_MARKET_API_URL}/company/${symbol}`),
        axios.get(`${process.env.REACT_APP_MARKET_API_URL}/history/${symbol}?interval=${timeframe}`)
      ]);

      setQuote(quoteRes.data.data);
      setCompany(companyRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stock-loading">Loading stock data...</div>;
  }

  if (!quote) {
    return <div className="stock-error">Stock not found</div>;
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="stock-detail">
      <div className="stock-header">
        <div className="stock-title">
          <h1>{quote.symbol}</h1>
          <p>{company?.name}</p>
        </div>
        <div className="stock-price-section">
          <div className="stock-price">₹{quote.price.toFixed(2)}</div>
          <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(quote.change).toFixed(2)} ({Math.abs(quote.changePercent).toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h2><FaChartLine /> Price Chart</h2>
          <div className="timeframe-buttons">
            {['1min', '5min', 'daily', 'weekly', 'monthly'].map(tf => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf === '1min' ? '1M' : tf === '5min' ? '5M' : tf === 'daily' ? '1D' : tf === 'weekly' ? '1W' : '1M'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="close" stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="stock-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Open</span>
            <span className="stat-value">₹{quote.open.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">High</span>
            <span className="stat-value">₹{quote.high.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low</span>
            <span className="stat-value">₹{quote.low.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Prev Close</span>
            <span className="stat-value">₹{quote.previousClose.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{(quote.volume / 1000000).toFixed(2)}M</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">52W High</span>
            <span className="stat-value">₹{company?.week52High || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">52W Low</span>
            <span className="stat-value">₹{company?.week52Low || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">P/E Ratio</span>
            <span className="stat-value">{company?.peRatio || 'N/A'}</span>
          </div>
        </div>
      </div>

      {company && (
        <div className="company-info">
          <h2>About {company.name}</h2>
          <p className="company-description">{company.description}</p>
          <div className="company-details">
            <div className="detail-item">
              <span>Sector:</span> <strong>{company.sector}</strong>
            </div>
            <div className="detail-item">
              <span>Industry:</span> <strong>{company.industry}</strong>
            </div>
            <div className="detail-item">
              <span>Market Cap:</span> <strong>₹{(company.marketCap / 10000000).toFixed(2)}Cr</strong>
            </div>
            <div className="detail-item">
              <span>EPS:</span> <strong>{company.eps}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetail;

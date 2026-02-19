import React, { useState, useEffect } from 'react';
import { getIndices, getStocks, getCommodities, getCurrencies, getBonds, getIPOs } from '../services/marketApi';
import { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews } from '../services/newsApi';
import './Home.css';

const Home = () => {
  const [indices, setIndices] = useState([]);
  const [stocks, setStocks] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [ipos, setIpos] = useState([]);
  const [news, setNews] = useState([]);
  const [activeNewsTab, setActiveNewsTab] = useState('india');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchIndices, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNews(activeNewsTab);
  }, [activeNewsTab]);

  const fetchData = async () => {
    try {
      const [indicesRes, stocksRes, commoditiesRes, currenciesRes, bondsRes, iposRes] = await Promise.all([
        getIndices(),
        getStocks(),
        getCommodities(),
        getCurrencies(),
        getBonds(),
        getIPOs()
      ]);
      setIndices(indicesRes.data.data);
      setStocks(stocksRes.data.data);
      setCommodities(commoditiesRes.data.data);
      setCurrencies(currenciesRes.data.data);
      setBonds(bondsRes.data.data);
      setIpos(iposRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchIndices = async () => {
    try {
      const res = await getIndices();
      setIndices(res.data.data);
    } catch (error) {
      console.error('Error fetching indices:', error);
    }
  };

  const fetchNews = async (category) => {
    try {
      let res;
      switch(category) {
        case 'india': res = await getIndiaNews(); break;
        case 'global': res = await getGlobalNews(); break;
        case 'tech': res = await getTechNews(); break;
        case 'finance': res = await getFinanceNews(); break;
        case 'politics': res = await getPoliticsNews(); break;
        case 'trending': res = await getTrendingNews(); break;
        default: res = await getIndiaNews();
      }
      setNews(res.data.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  if (loading) {
    return <div className="loading">Loading market data...</div>;
  }

  return (
    <div className="home">
      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          cursor: 'pointer',
          fontSize: '24px',
          zIndex: 1000,
          boxShadow: '0 4px 15px var(--shadow)',
          transition: 'all 0.3s ease'
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Live Market Indices Bar */}
      <div className="indices-bar">
        {indices.map((index) => (
          <div key={index.symbol} className="index-item">
            <span className="index-name">{index.name}</span>
            <span className="index-value">{index.value.toLocaleString()}</span>
            <span className={`index-change ${index.changePercent >= 0 ? 'positive' : 'negative'}`}>
              {index.changePercent >= 0 ? '▲' : '▼'} {Math.abs(index.changePercent)}%
            </span>
          </div>
        ))}
      </div>

      {/* Single Column Layout */}
      <div className="main-content">
        {/* News Section */}
        <div className="news-section">
          <h2 className="section-title">Latest News</h2>
          <div className="news-tabs">
            {['india', 'global', 'tech', 'finance', 'politics', 'trending'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeNewsTab === tab ? 'active' : ''}`}
                onClick={() => setActiveNewsTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="news-feed">
            {news.map(item => (
              <div key={item.id} className="news-card">
                <img src={item.image} alt={item.headline} />
                <div className="news-content">
                  <h3>{item.headline}</h3>
                  <div className="news-meta">
                    <span className="news-source">{item.source}</span>
                    <span className="news-time">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stocks Section */}
        <div className="stocks-section">
          <h2 className="section-title">Market Stocks</h2>
          <div className="stock-grid">
          {/* Pro Stocks */}
          <div className="stock-list pro-stocks">
            <h3>🔒 Pro Stocks</h3>
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

          {/* Top in Action */}
          <div className="stock-list">
            <h3>Top in Action</h3>
            {stocks.topInAction?.map(stock => (
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

          {/* Top Nifty 50 */}
          <div className="stock-list">
            <h3>Top Nifty 50</h3>
            {stocks.topNifty50?.map(stock => (
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

          {/* Top Gainers */}
          <div className="stock-list">
            <h3>Top Gainers</h3>
            {stocks.topGainers?.map(stock => (
              <div key={stock.symbol} className="stock-item">
                <div>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div>
                  <div className="stock-price">₹{stock.price}</div>
                  <div className="stock-change positive">+{stock.change}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Losers */}
          <div className="stock-list">
            <h3>Top Losers</h3>
            {stocks.topLosers?.map(stock => (
              <div key={stock.symbol} className="stock-item">
                <div>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div>
                  <div className="stock-price">₹{stock.price}</div>
                  <div className="stock-change negative">{stock.change}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Mutual Funds */}
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

      {/* Three Column Split */}
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

      {/* IPO Section */}
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

      {/* Newsletter */}
      <div className="newsletter">
        <h2>Subscribe for Daily Market Updates</h2>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/careers">Careers</a>
        </div>
        <div className="social-links">
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="LinkedIn">💼</a>
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Instagram">📷</a>
        </div>
        <p>© 2026 FintechOps. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

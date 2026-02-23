import React, { useState, useEffect } from 'react';
import { getIndices, getStocks, getCommodities, getCurrencies, getBonds, getIPOs } from '../services/marketApi';
import { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews } from '../services/newsApi';
import IndicesBar from '../components/home/IndicesBar/IndicesBar';
import NewsSection from '../components/home/NewsSection/NewsSection';
import StocksSection from '../components/home/StocksSection/StocksSection';
import MarketOverview from '../components/home/MarketOverview/MarketOverview';
import IPOSection from '../components/home/IPOSection/IPOSection';
import Newsletter from '../components/home/Newsletter/Newsletter';
import Footer from '../components/home/Footer/Footer';
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
  const [newsLoading, setNewsLoading] = useState(false);

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
    setNewsLoading(true);
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
      setNews(res.data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading market data...</div>;
  }

  return (
    <div className="home">
      <IndicesBar indices={indices} />

      <div className="main-content">
        <NewsSection 
          news={news} 
          activeTab={activeNewsTab} 
          onTabChange={setActiveNewsTab}
          loading={newsLoading}
        />
        <StocksSection stocks={stocks} />
      </div>

      <MarketOverview 
        commodities={commodities} 
        currencies={currencies} 
        bonds={bonds} 
      />

      <IPOSection ipos={ipos} />

      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;

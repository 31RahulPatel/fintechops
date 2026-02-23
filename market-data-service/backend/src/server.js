const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getIndices, getStocks, getCommodities, getCurrencies } = require('./services/alphaVantage');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/market/indices', async (req, res) => {
  try {
    const indices = await getIndices();
    res.json({ success: true, data: indices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/market/stocks', async (req, res) => {
  try {
    const stocks = await getStocks();
    const data = {
      topInAction: stocks.slice(0, 5),
      topNifty50: stocks.slice(0, 5),
      topGainers: stocks.filter(s => s.change > 0).slice(0, 5),
      topLosers: stocks.filter(s => s.change < 0).slice(0, 5),
      topMutualFunds: [
        { name: 'HDFC Flexi Cap Fund', nav: 856.45, returns1Y: 18.5, change: 0.85 },
        { name: 'ICICI Prudential Bluechip', nav: 98.75, returns1Y: 16.2, change: 0.65 },
        { name: 'SBI Large & Midcap Fund', nav: 245.30, returns1Y: 22.8, change: 1.15 }
      ],
      proStocks: stocks.slice(0, 3)
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/market/commodities', async (req, res) => {
  try {
    const commodities = await getCommodities();
    res.json({ success: true, data: commodities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/market/currencies', async (req, res) => {
  try {
    const currencies = await getCurrencies();
    res.json({ success: true, data: currencies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/market/bonds', (req, res) => {
  const bonds = [
    { name: '10Y Govt Bond', symbol: 'IN10Y', yield: 7.15, change: 0.05 },
    { name: 'Corporate AAA Bond', symbol: 'CORPAAA', yield: 8.25, change: -0.03 }
  ];
  res.json({ success: true, data: bonds });
});

app.get('/api/market/ipos', (req, res) => {
  const ipos = [
    { company: 'TechVision Solutions Ltd', priceRange: '₹450-475', openDate: '2026-02-15', closeDate: '2026-02-18', subscription: '12.5x', status: 'Open' },
    { company: 'Green Energy Power Ltd', priceRange: '₹280-310', openDate: '2026-02-20', closeDate: '2026-02-24', subscription: 'Upcoming', status: 'Upcoming' }
  ];
  res.json({ success: true, data: ipos });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'market-data-service' });
});

app.listen(PORT, () => {
  console.log(`Market Data Service running on port ${PORT}`);
});

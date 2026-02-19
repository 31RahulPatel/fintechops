const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getIndices, getStocks } = require('./services/yahooFinance');

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
      proStocks: stocks.slice(0, 3)
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/market/commodities', (req, res) => {
  const commodities = [
    { name: 'Gold', symbol: 'GOLD', price: 62450, unit: '₹/10g', changePercent: 0.5 },
    { name: 'Silver', symbol: 'SILVER', price: 74200, unit: '₹/kg', changePercent: -0.3 },
    { name: 'Crude Oil', symbol: 'CRUDEOIL', price: 6845, unit: '₹/barrel', changePercent: 1.2 }
  ];
  res.json({ success: true, data: commodities });
});

app.get('/api/market/currencies', (req, res) => {
  const currencies = [
    { name: 'USD/INR', symbol: 'USDINR', value: 83.25, changePercent: 0.15 },
    { name: 'EUR/INR', symbol: 'EURINR', value: 90.45, changePercent: -0.08 },
    { name: 'GBP/INR', symbol: 'GBPINR', value: 105.80, changePercent: 0.22 }
  ];
  res.json({ success: true, data: currencies });
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

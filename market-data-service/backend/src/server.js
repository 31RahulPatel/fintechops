const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const GROWW_API_URL = 'https://api.groww.in/v1';
const GROWW_TOKEN = process.env.GROWW_API_TOKEN || '';

const growwHeaders = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${GROWW_TOKEN}`,
  'X-API-VERSION': '1.0'
};

// Stock search
app.get('/api/market/search', async (req, res) => {
  const { q } = req.query;
  const stocks = [
    { symbol: 'NSE_RELIANCE', name: 'Reliance Industries Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_TCS', name: 'Tata Consultancy Services', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_INFY', name: 'Infosys Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_HDFCBANK', name: 'HDFC Bank Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_ICICIBANK', name: 'ICICI Bank Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_WIPRO', name: 'Wipro Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_SBIN', name: 'State Bank of India', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'NSE_BHARTIARTL', name: 'Bharti Airtel Ltd', type: 'Equity', region: 'India', currency: 'INR' }
  ];
  const results = q ? stocks.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.symbol.toLowerCase().includes(q.toLowerCase())) : stocks;
  res.json({ success: true, data: results });
});

// Get stock quote (Groww API)
app.get('/api/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const [exchange, trading_symbol] = symbol.split('_');
    
    if (!GROWW_TOKEN) throw new Error('No token');
    
    const response = await axios.get(`${GROWW_API_URL}/live-data/quote`, {
      params: { exchange, segment: 'CASH', trading_symbol },
      headers: growwHeaders
    });

    if (response.data.status === 'SUCCESS') {
      const payload = response.data.payload;
      let ohlc = { open: 0, high: 0, low: 0, close: 0 };
      if (payload.ohlc) {
        try {
          ohlc = JSON.parse(payload.ohlc.replace(/'/g, '"'));
        } catch (e) {
          console.error('OHLC parse error:', e);
        }
      }
      const data = {
        symbol,
        price: payload.last_price,
        change: payload.day_change,
        changePercent: payload.day_change_perc,
        volume: payload.volume,
        open: ohlc.open,
        high: ohlc.high,
        low: ohlc.low,
        previousClose: ohlc.close,
        marketCap: payload.market_cap,
        week52High: payload.week_52_high,
        week52Low: payload.week_52_low,
        latestTradingDay: new Date().toISOString().split('T')[0]
      };
      return res.json({ success: true, data });
    }
    throw new Error('API failed');
  } catch (error) {
    res.json({ success: true, data: mockStockQuote(req.params.symbol) });
  }
});

// Get LTP for multiple stocks (up to 50 symbols)
app.get('/api/market/ltp', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) return res.status(400).json({ error: 'Symbols required' });
    if (!GROWW_TOKEN) throw new Error('No token');
    
    const response = await axios.get(`${GROWW_API_URL}/live-data/ltp`, {
      params: { segment: 'CASH', exchange_symbols: symbols },
      headers: growwHeaders
    });

    if (response.data.status === 'SUCCESS') {
      return res.json({ success: true, data: response.data.payload });
    }
    throw new Error('API failed');
  } catch (error) {
    res.json({ success: true, data: {} });
  }
});

// Get OHLC for multiple stocks (up to 50 symbols)
app.get('/api/market/ohlc', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) return res.status(400).json({ error: 'Symbols required' });
    if (!GROWW_TOKEN) throw new Error('No token');
    
    const response = await axios.get(`${GROWW_API_URL}/live-data/ohlc`, {
      params: { segment: 'CASH', exchange_symbols: symbols },
      headers: growwHeaders
    });

    if (response.data.status === 'SUCCESS') {
      const parsed = {};
      for (const [sym, ohlcStr] of Object.entries(response.data.payload)) {
        try {
          parsed[sym] = JSON.parse(ohlcStr.replace(/'/g, '"'));
        } catch (e) {
          parsed[sym] = ohlcStr;
        }
      }
      return res.json({ success: true, data: parsed });
    }
    throw new Error('API failed');
  } catch (error) {
    res.json({ success: true, data: {} });
  }
});

// Get historical data
app.get('/api/market/history/:symbol', async (req, res) => {
  const data = mockHistoricalData(req.params.symbol);
  res.json({ success: true, data });
});

// Get company overview
app.get('/api/market/company/:symbol', async (req, res) => {
  const data = mockCompanyOverview(req.params.symbol);
  res.json({ success: true, data });
});

// Market indices
app.get('/api/market/indices', async (req, res) => {
  try {
    const symbols = 'NSE_NIFTY,BSE_SENSEX,NSE_BANKNIFTY,NSE_NIFTYIT';
    const response = await axios.get(`${GROWW_API_URL}/live-data/ltp`, {
      params: { segment: 'CASH', exchange_symbols: symbols },
      headers: growwHeaders
    });

    if (response.data.status === 'SUCCESS') {
      const payload = response.data.payload;
      const indices = [
        { name: 'NIFTY 50', symbol: 'NSE_NIFTY', value: payload.NSE_NIFTY || 23456.78, change: 145.32, changePercent: 0.62 },
        { name: 'SENSEX', symbol: 'BSE_SENSEX', value: payload.BSE_SENSEX || 77234.56, change: 234.12, changePercent: 0.30 },
        { name: 'NIFTY BANK', symbol: 'NSE_BANKNIFTY', value: payload.NSE_BANKNIFTY || 51234.45, change: -123.45, changePercent: -0.24 },
        { name: 'NIFTY IT', symbol: 'NSE_NIFTYIT', value: payload.NSE_NIFTYIT || 34567.89, change: 234.56, changePercent: 0.68 }
      ];
      return res.json({ success: true, data: indices });
    }
  } catch (error) {
    console.error('Indices error:', error.message);
  }
  
  const indices = [
    { name: 'NIFTY 50', symbol: 'NSE_NIFTY', value: 23456.78, change: 145.32, changePercent: 0.62 },
    { name: 'SENSEX', symbol: 'BSE_SENSEX', value: 77234.56, change: 234.12, changePercent: 0.30 },
    { name: 'NIFTY BANK', symbol: 'NSE_BANKNIFTY', value: 51234.45, change: -123.45, changePercent: -0.24 },
    { name: 'NIFTY IT', symbol: 'NSE_NIFTYIT', value: 34567.89, change: 234.56, changePercent: 0.68 }
  ];
  res.json({ success: true, data: indices });
});

// Top gainers/losers
app.get('/api/market/movers', (req, res) => {
  const { type = 'gainers' } = req.query;
  const gainers = [
    { symbol: 'NSE_RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 89.45, changePercent: 3.78 },
    { symbol: 'NSE_TCS', name: 'TCS', price: 3678.90, change: 112.30, changePercent: 3.15 },
    { symbol: 'NSE_INFY', name: 'Infosys', price: 1567.45, change: 45.67, changePercent: 3.00 }
  ];
  const losers = [
    { symbol: 'NSE_HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: -45.67, changePercent: -2.65 },
    { symbol: 'NSE_ICICIBANK', name: 'ICICI Bank', price: 1123.45, change: -34.56, changePercent: -2.99 }
  ];
  res.json({ success: true, data: type === 'gainers' ? gainers : losers });
});

app.get('/api/market/stocks', (req, res) => {
  const stocks = {
    topGainers: [
      { symbol: 'NSE_RELIANCE', name: 'Reliance', price: 2456.75, change: 89.45, changePercent: 3.78 },
      { symbol: 'NSE_TCS', name: 'TCS', price: 3678.90, change: 112.30, changePercent: 3.15 }
    ],
    topLosers: [
      { symbol: 'NSE_HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: -45.67, changePercent: -2.65 }
    ],
    topNifty50: [
      { symbol: 'NSE_RELIANCE', name: 'Reliance', price: 2456.75, change: 89.45, changePercent: 3.78 }
    ]
  };
  res.json({ success: true, data: stocks });
});

app.get('/api/market/commodities', (req, res) => {
  const commodities = [
    { name: 'Gold', symbol: 'GOLD', price: 62345.50, change: 234.50, changePercent: 0.38 },
    { name: 'Silver', symbol: 'SILVER', price: 74567.80, change: -123.40, changePercent: -0.17 }
  ];
  res.json({ success: true, data: commodities });
});

app.get('/api/market/currencies', (req, res) => {
  const currencies = [
    { name: 'USD/INR', symbol: 'USDINR', price: 83.45, change: 0.12, changePercent: 0.14 }
  ];
  res.json({ success: true, data: currencies });
});

app.get('/api/market/bonds', (req, res) => {
  const bonds = [{ name: '10Y Govt Bond', symbol: 'IN10Y', yield: 7.15, change: 0.05 }];
  res.json({ success: true, data: bonds });
});

app.get('/api/market/ipos', (req, res) => {
  const ipos = [{ company: 'TechVision Solutions', priceRange: '₹450-475', openDate: '2026-02-15', closeDate: '2026-02-18', subscription: '12.5x', status: 'Open' }];
  res.json({ success: true, data: ipos });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'market-data-service' });
});

function mockStockQuote(symbol) {
  return {
    symbol,
    price: 2456.75,
    change: 45.67,
    changePercent: 1.89,
    volume: 12345678,
    open: 2420.50,
    high: 2478.90,
    low: 2415.30,
    previousClose: 2411.08,
    latestTradingDay: new Date().toISOString().split('T')[0]
  };
}

function mockHistoricalData(symbol) {
  const data = [];
  const today = new Date();
  for (let i = 100; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const basePrice = 2400 + Math.random() * 200;
    data.push({
      date: date.toISOString().split('T')[0],
      open: basePrice,
      high: basePrice + Math.random() * 50,
      low: basePrice - Math.random() * 50,
      close: basePrice + (Math.random() - 0.5) * 40,
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  return data;
}

function mockCompanyOverview(symbol) {
  return {
    symbol,
    name: symbol.split('_')[1] + ' Ltd',
    description: 'Leading Indian company',
    sector: 'Technology',
    industry: 'Software',
    marketCap: '1500000000000',
    peRatio: '25.5',
    eps: '95.50',
    dividendYield: '1.2',
    week52High: '2678.90',
    week52Low: '2123.45',
    beta: '1.15',
    profitMargin: '0.18',
    operatingMargin: '0.22'
  };
}

app.listen(PORT, () => {
  console.log(`✅ Market Data Service running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Alpha Vantage API (Free tier: 25 requests/day)
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

// Yahoo Finance Alternative (No API key needed)
const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v8/finance';

// Stock search with autocomplete
app.get('/api/market/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const response = await axios.get(`${ALPHA_VANTAGE_URL}`, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: q,
        apikey: ALPHA_VANTAGE_KEY
      }
    });

    const results = (response.data.bestMatches || []).map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency']
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    res.json({ success: true, data: mockSearchResults(req.query.q) });
  }
});

// Get stock quote (real-time)
app.get('/api/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get(`${ALPHA_VANTAGE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY
      }
    });

    const quote = response.data['Global Quote'];
    if (!quote || !quote['01. symbol']) {
      throw new Error('No data');
    }

    const data = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      previousClose: parseFloat(quote['08. previous close']),
      latestTradingDay: quote['07. latest trading day']
    };

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: true, data: mockStockQuote(req.params.symbol) });
  }
});

// Get historical data for charts
app.get('/api/market/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = 'daily' } = req.query;

    const functionMap = {
      '1min': 'TIME_SERIES_INTRADAY',
      '5min': 'TIME_SERIES_INTRADAY',
      'daily': 'TIME_SERIES_DAILY',
      'weekly': 'TIME_SERIES_WEEKLY',
      'monthly': 'TIME_SERIES_MONTHLY'
    };

    const params = {
      function: functionMap[interval] || 'TIME_SERIES_DAILY',
      symbol: symbol,
      apikey: ALPHA_VANTAGE_KEY
    };

    if (interval.includes('min')) {
      params.interval = interval;
    }

    const response = await axios.get(ALPHA_VANTAGE_URL, { params });
    
    const timeSeriesKey = Object.keys(response.data).find(key => key.includes('Time Series'));
    const timeSeries = response.data[timeSeriesKey];

    const data = Object.entries(timeSeries || {}).slice(0, 100).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: true, data: mockHistoricalData(req.params.symbol) });
  }
});

// Get company overview
app.get('/api/market/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get(`${ALPHA_VANTAGE_URL}`, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY
      }
    });

    const data = {
      symbol: response.data.Symbol,
      name: response.data.Name,
      description: response.data.Description,
      sector: response.data.Sector,
      industry: response.data.Industry,
      marketCap: response.data.MarketCapitalization,
      peRatio: response.data.PERatio,
      eps: response.data.EPS,
      dividendYield: response.data.DividendYield,
      week52High: response.data['52WeekHigh'],
      week52Low: response.data['52WeekLow'],
      beta: response.data.Beta,
      profitMargin: response.data.ProfitMargin,
      operatingMargin: response.data.OperatingMarginTTM
    };

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: true, data: mockCompanyOverview(req.params.symbol) });
  }
});

// Market indices
app.get('/api/market/indices', async (req, res) => {
  const indices = [
    { name: 'NIFTY 50', symbol: '^NSEI', value: 23456.78, change: 145.32, changePercent: 0.62 },
    { name: 'SENSEX', symbol: '^BSESN', value: 77234.56, change: 234.12, changePercent: 0.30 },
    { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 51234.45, change: -123.45, changePercent: -0.24 },
    { name: 'NIFTY IT', symbol: '^CNXIT', value: 34567.89, change: 234.56, changePercent: 0.68 }
  ];
  res.json({ success: true, data: indices });
});

// Top gainers/losers
app.get('/api/market/movers', async (req, res) => {
  const { type = 'gainers' } = req.query;
  
  const gainers = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2456.75, change: 89.45, changePercent: 3.78 },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3678.90, change: 112.30, changePercent: 3.15 },
    { symbol: 'INFY.NS', name: 'Infosys', price: 1567.45, change: 45.67, changePercent: 3.00 }
  ];

  const losers = [
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1678.90, change: -45.67, changePercent: -2.65 },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1123.45, change: -34.56, changePercent: -2.99 },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', price: 1089.67, change: -28.90, changePercent: -2.58 }
  ];

  res.json({ success: true, data: type === 'gainers' ? gainers : losers });
});

// Stocks list
app.get('/api/market/stocks', async (req, res) => {
  const stocks = {
    topGainers: [
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2456.75, change: 89.45, changePercent: 3.78 },
      { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3678.90, change: 112.30, changePercent: 3.15 }
    ],
    topLosers: [
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1678.90, change: -45.67, changePercent: -2.65 },
      { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1123.45, change: -34.56, changePercent: -2.99 }
    ],
    topNifty50: [
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2456.75, change: 89.45, changePercent: 3.78 },
      { symbol: 'TCS.NS', name: 'TCS', price: 3678.90, change: 112.30, changePercent: 3.15 }
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
    { name: 'USD/INR', symbol: 'USDINR', price: 83.45, change: 0.12, changePercent: 0.14 },
    { name: 'EUR/INR', symbol: 'EURINR', price: 90.23, change: -0.34, changePercent: -0.38 }
  ];
  res.json({ success: true, data: currencies });
});

app.get('/api/market/bonds', (req, res) => {
  const bonds = [
    { name: '10Y Govt Bond', symbol: 'IN10Y', yield: 7.15, change: 0.05 }
  ];
  res.json({ success: true, data: bonds });
});

app.get('/api/market/ipos', (req, res) => {
  const ipos = [
    { company: 'TechVision Solutions', priceRange: '₹450-475', openDate: '2026-02-15', closeDate: '2026-02-18', subscription: '12.5x', status: 'Open' }
  ];
  res.json({ success: true, data: ipos });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'market-data-service' });
});

// Mock data functions
function mockSearchResults(query) {
  const stocks = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', type: 'Equity', region: 'India', currency: 'INR' },
    { symbol: 'INFY.NS', name: 'Infosys Ltd', type: 'Equity', region: 'India', currency: 'INR' }
  ];
  return stocks.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.symbol.toLowerCase().includes(query.toLowerCase()));
}

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
    name: 'Sample Company Ltd',
    description: 'Leading company in its sector',
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

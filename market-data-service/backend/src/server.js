const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mock data generators
const generateRandomChange = (base, variance = 5) => {
  const change = (Math.random() - 0.5) * variance;
  return {
    value: +(base + change).toFixed(2),
    change: +change.toFixed(2),
    changePercent: +((change / base) * 100).toFixed(2)
  };
};

// Market Indices
app.get('/api/market/indices', (req, res) => {
  const indices = [
    { name: 'Nifty 50', symbol: 'NIFTY', ...generateRandomChange(22150, 200) },
    { name: 'Sensex', symbol: 'SENSEX', ...generateRandomChange(73200, 500) },
    { name: 'Bank Nifty', symbol: 'BANKNIFTY', ...generateRandomChange(47800, 300) },
    { name: 'Nifty Midcap', symbol: 'NIFTYMID', ...generateRandomChange(52400, 400) },
    { name: 'India VIX', symbol: 'VIX', ...generateRandomChange(13.5, 1) }
  ];
  res.json({ success: true, data: indices });
});

// Stocks
app.get('/api/market/stocks', (req, res) => {
  const stocks = {
    proStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.50, change: 2.3, volume: '5.2M', recommendation: 'Strong Buy' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.75, change: 1.8, volume: '2.1M', recommendation: 'Buy' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1685.20, change: -0.5, volume: '8.3M', recommendation: 'Hold' }
    ],
    topInAction: [
      { symbol: 'INFY', name: 'Infosys', price: 1542.30, change: 3.2, volume: '6.5M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.45, change: 2.1, volume: '12.4M' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1345.80, change: 1.9, volume: '4.2M' },
      { symbol: 'ITC', name: 'ITC Ltd', price: 465.25, change: -1.2, volume: '15.8M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 745.60, change: 2.8, volume: '18.3M' }
    ],
    topNifty50: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.50, change: 2.3, volume: '5.2M' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.75, change: 1.8, volume: '2.1M' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1685.20, change: -0.5, volume: '8.3M' },
      { symbol: 'INFY', name: 'Infosys', price: 1542.30, change: 3.2, volume: '6.5M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.45, change: 2.1, volume: '12.4M' }
    ],
    topGainers: [
      { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1285.40, change: 5.8, volume: '3.2M' },
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 145.75, change: 4.5, volume: '25.6M' },
      { symbol: 'HINDALCO', name: 'Hindalco Industries', price: 625.30, change: 4.2, volume: '8.9M' },
      { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 895.60, change: 3.9, volume: '6.4M' },
      { symbol: 'COALINDIA', name: 'Coal India', price: 425.80, change: 3.5, volume: '12.1M' }
    ],
    topLosers: [
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6845.20, change: -3.8, volume: '1.8M' },
      { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2945.50, change: -2.9, volume: '2.3M' },
      { symbol: 'NESTLEIND', name: 'Nestle India', price: 24500.00, change: -2.5, volume: '0.3M' },
      { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 4825.75, change: -2.2, volume: '0.8M' },
      { symbol: 'TITAN', name: 'Titan Company', price: 3420.30, change: -1.9, volume: '3.5M' }
    ],
    topMutualFunds: [
      { name: 'SBI Bluechip Fund', nav: 68.45, change: 1.2, returns1Y: 18.5, returns3Y: 15.2 },
      { name: 'HDFC Top 100 Fund', nav: 845.30, change: 0.9, returns1Y: 17.8, returns3Y: 14.8 },
      { name: 'ICICI Prudential Equity Fund', nav: 425.60, change: 1.5, returns1Y: 19.2, returns3Y: 16.1 },
      { name: 'Axis Bluechip Fund', nav: 52.80, change: 0.7, returns1Y: 16.9, returns3Y: 14.5 },
      { name: 'Mirae Asset Large Cap Fund', nav: 95.25, change: 1.3, returns1Y: 20.1, returns3Y: 17.3 }
    ]
  };
  res.json({ success: true, data: stocks });
});

// Commodities
app.get('/api/market/commodities', (req, res) => {
  const commodities = [
    { name: 'Gold', symbol: 'GOLD', price: 62450, unit: '₹/10g', ...generateRandomChange(62450, 500) },
    { name: 'Silver', symbol: 'SILVER', price: 74200, unit: '₹/kg', ...generateRandomChange(74200, 800) },
    { name: 'Crude Oil', symbol: 'CRUDEOIL', price: 6845, unit: '₹/barrel', ...generateRandomChange(6845, 200) }
  ];
  res.json({ success: true, data: commodities });
});

// Currencies
app.get('/api/market/currencies', (req, res) => {
  const currencies = [
    { name: 'USD/INR', symbol: 'USDINR', ...generateRandomChange(83.25, 0.5) },
    { name: 'EUR/INR', symbol: 'EURINR', ...generateRandomChange(90.45, 0.6) },
    { name: 'GBP/INR', symbol: 'GBPINR', ...generateRandomChange(105.80, 0.8) }
  ];
  res.json({ success: true, data: currencies });
});

// Bonds
app.get('/api/market/bonds', (req, res) => {
  const bonds = [
    { name: '10Y Govt Bond', symbol: 'IN10Y', yield: 7.15, price: 98.45, change: 0.05 },
    { name: 'Corporate AAA Bond', symbol: 'CORPAAA', yield: 8.25, price: 102.30, change: -0.03 }
  ];
  res.json({ success: true, data: bonds });
});

// IPOs
app.get('/api/market/ipos', (req, res) => {
  const ipos = [
    {
      company: 'TechVision Solutions Ltd',
      priceRange: '₹450-475',
      openDate: '2026-02-15',
      closeDate: '2026-02-18',
      lotSize: 30,
      subscription: '12.5x',
      status: 'Open'
    },
    {
      company: 'Green Energy Power Ltd',
      priceRange: '₹280-310',
      openDate: '2026-02-20',
      closeDate: '2026-02-24',
      lotSize: 45,
      subscription: 'Upcoming',
      status: 'Upcoming'
    },
    {
      company: 'FinServe Technologies',
      priceRange: '₹650-700',
      openDate: '2026-02-25',
      closeDate: '2026-02-28',
      lotSize: 20,
      subscription: 'Upcoming',
      status: 'Upcoming'
    }
  ];
  res.json({ success: true, data: ipos });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'market-data-service' });
});

app.listen(PORT, () => {
  console.log(`Market Data Service running on port ${PORT}`);
});

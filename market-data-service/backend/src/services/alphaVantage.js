const axios = require('axios');

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Indian stock symbols mapped to US equivalents for demo
const INDIAN_STOCKS = {
  'RELIANCE': 'RELIANCE.BSE',
  'TCS': 'TCS.BSE',
  'INFY': 'INFY',
  'HDFCBANK': 'HDB',
  'ICICIBANK': 'IBN',
  'SBIN': 'SBIN.BSE',
  'BHARTIARTL': 'BHARTIARTL.BSE',
  'ITC': 'ITC.BSE',
  'KOTAKBANK': 'KOTAKBANK.BSE',
  'LT': 'LT.BSE'
};

const getIndices = async () => {
  try {
    // Using major indices - Alpha Vantage doesn't have direct Indian indices on free tier
    const indices = [
      { name: 'NIFTY 50', symbol: '^NSEI', value: 21850.50, changePercent: 0.85 },
      { name: 'SENSEX', symbol: '^BSESN', value: 72240.26, changePercent: 0.92 },
      { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 46520.35, changePercent: 1.15 },
      { name: 'NIFTY IT', symbol: '^CNXIT', value: 32450.80, changePercent: -0.45 }
    ];
    
    return indices;
  } catch (error) {
    console.error('Error fetching indices:', error.message);
    return [];
  }
};

const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY
      }
    });
    
    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return null;
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
};

const getStocks = async () => {
  try {
    // For demo, return mock data with realistic values
    // In production, you'd call getStockQuote for each symbol
    const stocks = [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 1.25 },
      { symbol: 'TCS', name: 'Tata Consultancy', price: 3678.50, change: 0.85 },
      { symbol: 'INFY', name: 'Infosys', price: 1456.30, change: -0.45 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1598.20, change: 0.65 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1045.80, change: 1.15 },
      { symbol: 'SBIN', name: 'State Bank of India', price: 625.45, change: -0.35 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1234.60, change: 0.95 },
      { symbol: 'ITC', name: 'ITC Limited', price: 456.75, change: 0.55 },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1789.30, change: -0.25 },
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3456.90, change: 1.45 }
    ];
    
    return stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    return [];
  }
};

const getCommodities = async () => {
  try {
    // Alpha Vantage has commodity data but limited on free tier
    return [
      { name: 'Gold', symbol: 'GOLD', price: 62450, unit: '₹/10g', changePercent: 0.5 },
      { name: 'Silver', symbol: 'SILVER', price: 74200, unit: '₹/kg', changePercent: -0.3 },
      { name: 'Crude Oil', symbol: 'CRUDEOIL', price: 6845, unit: '₹/barrel', changePercent: 1.2 }
    ];
  } catch (error) {
    console.error('Error fetching commodities:', error.message);
    return [];
  }
};

const getCurrencies = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: 'USD',
        to_currency: 'INR',
        apikey: ALPHA_VANTAGE_KEY
      }
    });
    
    const rate = response.data['Realtime Currency Exchange Rate'];
    const usdInr = rate ? parseFloat(rate['5. Exchange Rate']) : 83.25;
    
    return [
      { name: 'USD/INR', symbol: 'USDINR', value: usdInr, changePercent: 0.15 },
      { name: 'EUR/INR', symbol: 'EURINR', value: 90.45, changePercent: -0.08 },
      { name: 'GBP/INR', symbol: 'GBPINR', value: 105.80, changePercent: 0.22 }
    ];
  } catch (error) {
    console.error('Error fetching currencies:', error.message);
    return [
      { name: 'USD/INR', symbol: 'USDINR', value: 83.25, changePercent: 0.15 },
      { name: 'EUR/INR', symbol: 'EURINR', value: 90.45, changePercent: -0.08 },
      { name: 'GBP/INR', symbol: 'GBPINR', value: 105.80, changePercent: 0.22 }
    ];
  }
};

module.exports = {
  getIndices,
  getStocks,
  getStockQuote,
  getCommodities,
  getCurrencies
};

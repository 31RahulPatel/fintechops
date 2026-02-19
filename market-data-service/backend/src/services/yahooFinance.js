const axios = require('axios');

const getYahooQuote = async (symbol) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url);
    const result = response.data.chart.result[0];
    const quote = result.meta;
    const current = result.indicators.quote[0];
    
    return {
      price: quote.regularMarketPrice,
      change: quote.regularMarketPrice - quote.previousClose,
      changePercent: ((quote.regularMarketPrice - quote.previousClose) / quote.previousClose) * 100,
      volume: current.volume[current.volume.length - 1]
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
};

const getIndices = async () => {
  const indices = [
    { name: 'Nifty 50', symbol: 'NIFTY', yahooSymbol: '^NSEI' },
    { name: 'Sensex', symbol: 'SENSEX', yahooSymbol: '^BSESN' },
    { name: 'Bank Nifty', symbol: 'BANKNIFTY', yahooSymbol: '^NSEBANK' }
  ];

  const results = [];
  for (const index of indices) {
    const data = await getYahooQuote(index.yahooSymbol);
    if (data) {
      results.push({
        name: index.name,
        symbol: index.symbol,
        value: Math.round(data.price),
        changePercent: parseFloat(data.changePercent.toFixed(2))
      });
    }
  }
  return results;
};

const getStocks = async () => {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', yahooSymbol: 'RELIANCE.NS' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', yahooSymbol: 'TCS.NS' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', yahooSymbol: 'HDFCBANK.NS' },
    { symbol: 'INFY', name: 'Infosys', yahooSymbol: 'INFY.NS' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', yahooSymbol: 'ICICIBANK.NS' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', yahooSymbol: 'BHARTIARTL.NS' },
    { symbol: 'ITC', name: 'ITC Ltd', yahooSymbol: 'ITC.NS' },
    { symbol: 'SBIN', name: 'State Bank of India', yahooSymbol: 'SBIN.NS' }
  ];

  const results = [];
  for (const stock of stocks) {
    const data = await getYahooQuote(stock.yahooSymbol);
    if (data) {
      results.push({
        symbol: stock.symbol,
        name: stock.name,
        price: parseFloat(data.price.toFixed(2)),
        change: parseFloat(data.changePercent.toFixed(2)),
        volume: data.volume ? `${(data.volume / 1000000).toFixed(1)}M` : 'N/A'
      });
    }
  }
  return results;
};

module.exports = { getIndices, getStocks };

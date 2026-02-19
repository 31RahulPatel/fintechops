import axios from 'axios';

const marketApi = axios.create({
  baseURL: process.env.REACT_APP_MARKET_API_URL || 'http://localhost:4000/api/market',
  timeout: 10000
});

export const getIndices = () => marketApi.get('/indices');
export const getStocks = () => marketApi.get('/stocks');
export const getCommodities = () => marketApi.get('/commodities');
export const getCurrencies = () => marketApi.get('/currencies');
export const getBonds = () => marketApi.get('/bonds');
export const getIPOs = () => marketApi.get('/ipos');

export default marketApi;

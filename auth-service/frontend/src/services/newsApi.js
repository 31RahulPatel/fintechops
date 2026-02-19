import axios from 'axios';

const newsApi = axios.create({
  baseURL: process.env.REACT_APP_NEWS_API_URL || 'http://localhost:5000/api/news',
  timeout: 10000
});

export const getIndiaNews = () => newsApi.get('/india');
export const getGlobalNews = () => newsApi.get('/global');
export const getTechNews = () => newsApi.get('/tech');
export const getFinanceNews = () => newsApi.get('/finance');
export const getPoliticsNews = () => newsApi.get('/politics');
export const getTrendingNews = () => newsApi.get('/trending');

export default newsApi;

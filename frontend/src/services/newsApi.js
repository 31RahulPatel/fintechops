import axios from 'axios';

const NEWS_API_KEY = 'pub_64119e0e0e0e5e3e8b8f8e8e8e8e8e8e8e8e';
const NEWS_API_URL = 'https://newsdata.io/api/1/news';

const fetchNews = async (category, country = 'in') => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        apikey: NEWS_API_KEY,
        country: country,
        category: category,
        language: 'en'
      }
    });
    return { data: { data: response.data.results || [] } };
  } catch (error) {
    console.error('News API Error:', error);
    return { data: { data: [] } };
  }
};

export const getIndiaNews = () => fetchNews('top', 'in');
export const getGlobalNews = () => fetchNews('world');
export const getTechNews = () => fetchNews('technology');
export const getFinanceNews = () => fetchNews('business');
export const getPoliticsNews = () => fetchNews('politics');
export const getTrendingNews = () => fetchNews('top');

export default { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews };

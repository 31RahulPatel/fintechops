import axios from 'axios';

const NEWS_API_URL = process.env.REACT_APP_NEWS_API_URL || 'http://localhost:5000/api/news';

const fetchNews = async (category) => {
  try {
    const response = await axios.get(`${NEWS_API_URL}/${category}`);
    
    if (response.data.success) {
      return { 
        data: { 
          data: response.data.data.map(item => ({
            title: item.headline,
            description: item.source,
            url: '#',
            image: item.image,
            publishedAt: item.time,
            source: { name: item.source }
          }))
        }
      };
    }
  } catch (error) {
    console.error('News API Error:', error.message);
  }
  return { data: { data: getMockNews() } };
};

const getMockNews = () => {
  return [
    { title: 'Markets Hit Record High', description: 'Strong economic data', url: '#', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', publishedAt: new Date().toISOString(), source: { name: 'Economic Times' } },
    { title: 'Tech Sector Shows Growth', description: 'Companies report earnings', url: '#', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', publishedAt: new Date().toISOString(), source: { name: 'Tech News' } },
    { title: 'Banking Sector Updates', description: 'Digital initiatives announced', url: '#', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400', publishedAt: new Date().toISOString(), source: { name: 'Finance Today' } },
    { title: 'Investment Opportunities', description: 'Analysts highlight potential', url: '#', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', publishedAt: new Date().toISOString(), source: { name: 'Investment Weekly' } },
    { title: 'Startup Funding News', description: 'New investments announced', url: '#', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400', publishedAt: new Date().toISOString(), source: { name: 'Startup News' } },
    { title: 'Economic Indicators', description: 'Growth trends continue', url: '#', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', publishedAt: new Date().toISOString(), source: { name: 'Business Standard' } }
  ];
};

export const getIndiaNews = () => fetchNews('india');
export const getGlobalNews = () => fetchNews('global');
export const getTechNews = () => fetchNews('tech');
export const getFinanceNews = () => fetchNews('finance');
export const getPoliticsNews = () => fetchNews('politics');
export const getTrendingNews = () => fetchNews('trending');

export default { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews };

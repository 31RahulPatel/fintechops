import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'demo';

const fetchNews = async (category) => {
  try {
    const categoryMap = {
      india: { country: 'in', category: 'general' },
      global: { country: 'us', category: 'general' },
      tech: { country: 'in', category: 'technology' },
      finance: { country: 'in', category: 'business' },
      politics: { country: 'in', category: 'general' },
      trending: { country: 'in', category: 'general' }
    };

    const params = categoryMap[category] || categoryMap.india;
    
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: NEWS_API_KEY,
        country: params.country,
        category: params.category,
        pageSize: 6
      }
    });

    const articles = (response.data.articles || []).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      publishedAt: article.publishedAt,
      source: { name: article.source.name }
    }));

    return { data: { data: articles } };
  } catch (error) {
    console.error('News API Error:', error.response?.data?.message || error.message);
    return { data: { data: getMockNews(category) } };
  }
};

const getMockNews = (category) => {
  const base = [
    { title: 'Markets Hit Record High', description: 'Strong economic data', url: '#', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', publishedAt: new Date().toISOString(), source: { name: 'Economic Times' } },
    { title: 'Tech Sector Shows Growth', description: 'Companies report earnings', url: '#', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', publishedAt: new Date().toISOString(), source: { name: 'Tech News' } },
    { title: 'Banking Sector Updates', description: 'Digital initiatives announced', url: '#', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400', publishedAt: new Date().toISOString(), source: { name: 'Finance Today' } },
    { title: 'Investment Opportunities', description: 'Analysts highlight potential', url: '#', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', publishedAt: new Date().toISOString(), source: { name: 'Investment Weekly' } },
    { title: 'Startup Funding News', description: 'New investments announced', url: '#', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400', publishedAt: new Date().toISOString(), source: { name: 'Startup News' } },
    { title: 'Economic Indicators', description: 'Growth trends continue', url: '#', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', publishedAt: new Date().toISOString(), source: { name: 'Business Standard' } }
  ];
  return base;
};

export const getIndiaNews = () => fetchNews('india');
export const getGlobalNews = () => fetchNews('global');
export const getTechNews = () => fetchNews('tech');
export const getFinanceNews = () => fetchNews('finance');
export const getPoliticsNews = () => fetchNews('politics');
export const getTrendingNews = () => fetchNews('trending');

export default { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews };

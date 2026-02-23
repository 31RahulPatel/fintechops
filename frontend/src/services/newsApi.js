import axios from 'axios';

const fetchNews = async (category) => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: 'f8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8',
        lang: 'en',
        country: category === 'india' ? 'in' : 'us',
        topic: category === 'tech' ? 'technology' : category === 'finance' ? 'business' : category === 'politics' ? 'nation' : 'breaking-news',
        max: 10
      }
    });
    return { data: { data: response.data.articles || [] } };
  } catch (error) {
    console.error('News API Error:', error);
    // Fallback mock data
    return { 
      data: { 
        data: [
          {
            title: 'Market reaches new highs amid positive sentiment',
            description: 'Stock markets continue their upward trajectory',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Market+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Financial Times' }
          },
          {
            title: 'Tech sector shows strong growth potential',
            description: 'Technology companies report better than expected earnings',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Tech+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Tech Today' }
          },
          {
            title: 'Global economy shows signs of recovery',
            description: 'Economic indicators point to sustained growth',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Economy+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Economic Times' }
          },
          {
            title: 'Investment opportunities in emerging markets',
            description: 'Analysts highlight potential in developing economies',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Investment+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Investment Weekly' }
          },
          {
            title: 'Banking sector announces new digital initiatives',
            description: 'Major banks invest in fintech solutions',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Banking+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Banking News' }
          },
          {
            title: 'Cryptocurrency market sees increased adoption',
            description: 'Digital currencies gain mainstream acceptance',
            url: '#',
            image: 'https://via.placeholder.com/400x200/000/fff?text=Crypto+News',
            publishedAt: new Date().toISOString(),
            source: { name: 'Crypto Daily' }
          }
        ] 
      } 
    };
  }
};

export const getIndiaNews = () => fetchNews('india');
export const getGlobalNews = () => fetchNews('global');
export const getTechNews = () => fetchNews('tech');
export const getFinanceNews = () => fetchNews('finance');
export const getPoliticsNews = () => fetchNews('politics');
export const getTrendingNews = () => fetchNews('trending');

export default { getIndiaNews, getGlobalNews, getTechNews, getFinanceNews, getPoliticsNews, getTrendingNews };

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const newsData = {
  india: [
    { id: 1, headline: 'Nifty 50 Hits All-Time High, Crosses 22,500 Mark', source: 'Economic Times', time: '2 hours ago', image: 'https://via.placeholder.com/300x200?text=Market+Rally', category: 'Markets' },
    { id: 2, headline: 'RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Stance', source: 'Business Standard', time: '3 hours ago', image: 'https://via.placeholder.com/300x200?text=RBI+Policy', category: 'Economy' },
    { id: 3, headline: 'Reliance Industries Announces ₹75,000 Crore Capex Plan', source: 'Mint', time: '5 hours ago', image: 'https://via.placeholder.com/300x200?text=Reliance', category: 'Corporate' },
    { id: 4, headline: 'India\'s GDP Growth Projected at 7.3% for FY2026', source: 'Financial Express', time: '6 hours ago', image: 'https://via.placeholder.com/300x200?text=GDP+Growth', category: 'Economy' },
    { id: 5, headline: 'SEBI Introduces New Regulations for Mutual Fund Distributors', source: 'Moneycontrol', time: '8 hours ago', image: 'https://via.placeholder.com/300x200?text=SEBI', category: 'Regulation' },
    { id: 6, headline: 'Tata Motors Reports 45% Jump in Q4 Profit', source: 'Economic Times', time: '10 hours ago', image: 'https://via.placeholder.com/300x200?text=Tata+Motors', category: 'Corporate' },
    { id: 7, headline: 'Foreign Investors Pour ₹12,000 Crore into Indian Equities', source: 'Business Line', time: '12 hours ago', image: 'https://via.placeholder.com/300x200?text=FII+Inflow', category: 'Markets' }
  ],
  global: [
    { id: 8, headline: 'Fed Signals Potential Rate Cuts in Second Half of 2026', source: 'Reuters', time: '1 hour ago', image: 'https://via.placeholder.com/300x200?text=Federal+Reserve', category: 'Global Economy' },
    { id: 9, headline: 'Oil Prices Surge 3% on Middle East Tensions', source: 'Bloomberg', time: '4 hours ago', image: 'https://via.placeholder.com/300x200?text=Oil+Prices', category: 'Commodities' },
    { id: 10, headline: 'Apple Unveils Revolutionary AI-Powered iPhone 16', source: 'CNBC', time: '5 hours ago', image: 'https://via.placeholder.com/300x200?text=Apple', category: 'Technology' },
    { id: 11, headline: 'European Markets Rally on Strong Economic Data', source: 'Financial Times', time: '7 hours ago', image: 'https://via.placeholder.com/300x200?text=Europe+Markets', category: 'Markets' },
    { id: 12, headline: 'China\'s Manufacturing PMI Beats Expectations', source: 'Wall Street Journal', time: '9 hours ago', image: 'https://via.placeholder.com/300x200?text=China+Economy', category: 'Global Economy' },
    { id: 13, headline: 'Tesla Stock Jumps 8% on Record Deliveries', source: 'MarketWatch', time: '11 hours ago', image: 'https://via.placeholder.com/300x200?text=Tesla', category: 'Technology' },
    { id: 14, headline: 'Gold Hits $2,100 Per Ounce Amid Safe-Haven Demand', source: 'Reuters', time: '13 hours ago', image: 'https://via.placeholder.com/300x200?text=Gold', category: 'Commodities' }
  ],
  tech: [
    { id: 15, headline: 'Google Launches Advanced AI Model Gemini 2.0', source: 'TechCrunch', time: '2 hours ago', image: 'https://via.placeholder.com/300x200?text=Google+AI', category: 'AI' },
    { id: 16, headline: 'Microsoft Azure Revenue Grows 30% Year-over-Year', source: 'The Verge', time: '4 hours ago', image: 'https://via.placeholder.com/300x200?text=Microsoft', category: 'Cloud' },
    { id: 17, headline: 'Indian IT Sector Sees 15% Growth in Q4 Exports', source: 'Economic Times', time: '6 hours ago', image: 'https://via.placeholder.com/300x200?text=IT+Sector', category: 'Industry' },
    { id: 18, headline: 'Meta Introduces New VR Headset for Enterprise', source: 'Wired', time: '8 hours ago', image: 'https://via.placeholder.com/300x200?text=Meta+VR', category: 'Hardware' },
    { id: 19, headline: 'Cybersecurity Spending to Reach $200 Billion in 2026', source: 'ZDNet', time: '10 hours ago', image: 'https://via.placeholder.com/300x200?text=Cybersecurity', category: 'Security' },
    { id: 20, headline: 'Amazon Web Services Launches New AI Tools for Developers', source: 'AWS Blog', time: '12 hours ago', image: 'https://via.placeholder.com/300x200?text=AWS', category: 'Cloud' },
    { id: 21, headline: 'Nvidia Stock Reaches New High on AI Chip Demand', source: 'CNBC', time: '14 hours ago', image: 'https://via.placeholder.com/300x200?text=Nvidia', category: 'Semiconductors' }
  ],
  finance: [
    { id: 22, headline: 'Top 5 Tax-Saving Investment Options for FY2026', source: 'Mint', time: '3 hours ago', image: 'https://via.placeholder.com/300x200?text=Tax+Saving', category: 'Personal Finance' },
    { id: 23, headline: 'How to Build a ₹1 Crore Retirement Corpus by Age 50', source: 'Moneycontrol', time: '5 hours ago', image: 'https://via.placeholder.com/300x200?text=Retirement', category: 'Planning' },
    { id: 24, headline: 'Best Mutual Funds for Long-Term Wealth Creation', source: 'Value Research', time: '7 hours ago', image: 'https://via.placeholder.com/300x200?text=Mutual+Funds', category: 'Investment' },
    { id: 25, headline: 'Credit Card Debt: 5 Smart Strategies to Pay Off Faster', source: 'Economic Times', time: '9 hours ago', image: 'https://via.placeholder.com/300x200?text=Credit+Card', category: 'Debt Management' },
    { id: 26, headline: 'Real Estate vs Gold: Which is Better Investment in 2026?', source: 'Housing.com', time: '11 hours ago', image: 'https://via.placeholder.com/300x200?text=Investment', category: 'Comparison' },
    { id: 27, headline: 'Emergency Fund: How Much Should You Save?', source: 'Financial Express', time: '13 hours ago', image: 'https://via.placeholder.com/300x200?text=Emergency+Fund', category: 'Savings' },
    { id: 28, headline: 'Insurance Planning: Term vs Endowment Policies', source: 'PolicyBazaar', time: '15 hours ago', image: 'https://via.placeholder.com/300x200?text=Insurance', category: 'Insurance' }
  ],
  politics: [
    { id: 29, headline: 'Budget 2026: Key Highlights for Middle Class Taxpayers', source: 'NDTV', time: '2 hours ago', image: 'https://via.placeholder.com/300x200?text=Budget', category: 'Policy' },
    { id: 30, headline: 'Government Announces New Startup India Initiative', source: 'The Hindu', time: '4 hours ago', image: 'https://via.placeholder.com/300x200?text=Startup+India', category: 'Business' },
    { id: 31, headline: 'Parliament Passes Digital India Bill 2026', source: 'Indian Express', time: '6 hours ago', image: 'https://via.placeholder.com/300x200?text=Digital+India', category: 'Technology' },
    { id: 32, headline: 'New Labour Reforms to Boost Manufacturing Sector', source: 'Business Standard', time: '8 hours ago', image: 'https://via.placeholder.com/300x200?text=Labour+Reform', category: 'Policy' },
    { id: 33, headline: 'India-US Trade Deal: Key Points Explained', source: 'Times of India', time: '10 hours ago', image: 'https://via.placeholder.com/300x200?text=Trade+Deal', category: 'International' },
    { id: 34, headline: 'Green Energy Policy: ₹50,000 Crore Allocation', source: 'Mint', time: '12 hours ago', image: 'https://via.placeholder.com/300x200?text=Green+Energy', category: 'Environment' },
    { id: 35, headline: 'GST Council Meeting: Rate Changes Announced', source: 'Economic Times', time: '14 hours ago', image: 'https://via.placeholder.com/300x200?text=GST', category: 'Taxation' }
  ],
  trending: [
    { id: 36, headline: 'Adani Group Stocks Rally 5% on New Project Announcement', source: 'Moneycontrol', time: '1 hour ago', image: 'https://via.placeholder.com/300x200?text=Adani', category: 'Trending' },
    { id: 37, headline: 'Bitcoin Crosses $70,000 Mark Amid Institutional Interest', source: 'CoinDesk', time: '3 hours ago', image: 'https://via.placeholder.com/300x200?text=Bitcoin', category: 'Crypto' },
    { id: 38, headline: 'Zomato Launches AI-Powered Food Recommendation Engine', source: 'YourStory', time: '5 hours ago', image: 'https://via.placeholder.com/300x200?text=Zomato', category: 'Startups' },
    { id: 39, headline: 'Paytm Stock Surges 12% on Regulatory Clarity', source: 'Business Today', time: '7 hours ago', image: 'https://via.placeholder.com/300x200?text=Paytm', category: 'Fintech' },
    { id: 40, headline: 'IPL 2026: Record-Breaking Sponsorship Deals Announced', source: 'Cricbuzz', time: '9 hours ago', image: 'https://via.placeholder.com/300x200?text=IPL', category: 'Sports Business' },
    { id: 41, headline: 'Ola Electric IPO Oversubscribed 8 Times on Day 1', source: 'Mint', time: '11 hours ago', image: 'https://via.placeholder.com/300x200?text=Ola+Electric', category: 'IPO' },
    { id: 42, headline: 'Nykaa Expands to Middle East Markets', source: 'Economic Times', time: '13 hours ago', image: 'https://via.placeholder.com/300x200?text=Nykaa', category: 'E-commerce' }
  ]
};

app.get('/api/news/india', (req, res) => {
  res.json({ success: true, data: newsData.india });
});

app.get('/api/news/global', (req, res) => {
  res.json({ success: true, data: newsData.global });
});

app.get('/api/news/tech', (req, res) => {
  res.json({ success: true, data: newsData.tech });
});

app.get('/api/news/finance', (req, res) => {
  res.json({ success: true, data: newsData.finance });
});

app.get('/api/news/politics', (req, res) => {
  res.json({ success: true, data: newsData.politics });
});

app.get('/api/news/trending', (req, res) => {
  res.json({ success: true, data: newsData.trending });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'news-service' });
});

app.listen(PORT, () => {
  console.log(`News Service running on port ${PORT}`);
});

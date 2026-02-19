import React from 'react';
import './NewsSection.css';

const NewsSection = ({ news, activeTab, onTabChange }) => {
  const tabs = ['india', 'global', 'tech', 'finance', 'politics', 'trending'];

  return (
    <div className="news-section">
      <h2 className="section-title">Latest News</h2>
      <div className="news-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="news-feed">
        {news.map(item => (
          <div key={item.id} className="news-card">
            <img src={item.image} alt={item.headline} />
            <div className="news-content">
              <h3>{item.headline}</h3>
              <div className="news-meta">
                <span className="news-source">{item.source}</span>
                <span className="news-time">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;

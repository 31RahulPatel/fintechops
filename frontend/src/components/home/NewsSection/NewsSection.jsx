import React from 'react';
import './NewsSection.css';

const NewsSection = ({ news, activeTab, onTabChange, loading }) => {
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
      {loading ? (
        <div className="news-loading">Loading news...</div>
      ) : (
        <div className="news-feed">
          {news.length > 0 ? (
            news.slice(0, 6).map((item, index) => (
              <a key={index} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="news-card">
                {item.image_url && <img src={item.image_url} alt={item.title} onError={(e) => e.target.style.display = 'none'} />}
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <div className="news-meta">
                    <span className="news-source">{item.source_id || 'News'}</span>
                    <span className="news-time">{new Date(item.pubDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="news-empty">No news available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsSection;

import React from 'react';
import './IndicesBar.css';

const IndicesBar = ({ indices }) => {
  return (
    <div className="indices-bar">
      {indices.map((index) => (
        <div key={index.symbol} className="index-item">
          <span className="index-name">{index.name}</span>
          <span className="index-value">{index.value.toLocaleString()}</span>
          <span className={`index-change ${index.changePercent >= 0 ? 'positive' : 'negative'}`}>
            {index.changePercent >= 0 ? '▲' : '▼'} {Math.abs(index.changePercent)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default IndicesBar;

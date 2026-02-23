import React, { useState } from 'react';
import { FaChartLine, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <div className="newsletter">
      <div className="newsletter-icon"><FaChartLine /></div>
      <h2>Stay Ahead of the Market</h2>
      <p>Get daily insights, market trends, and exclusive analysis delivered to your inbox</p>
      <form onSubmit={handleSubscribe}>
        <div className="input-wrapper">
          <span className="input-icon"><FaEnvelope /></span>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe Now →</button>
        </div>
      </form>
      <div className="newsletter-features">
        <span><FaCheckCircle /> Daily Market Reports</span>
        <span><FaCheckCircle /> Expert Analysis</span>
        <span><FaCheckCircle /> Exclusive Tips</span>
      </div>
    </div>
  );
};

export default Newsletter;

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>FintechOps</h3>
          <p>Your trusted platform for real-time market data, news, and financial insights.</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">📺</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Products</h4>
          <a href="/markets">Live Markets</a>
          <a href="/news">Financial News</a>
          <a href="/portfolio">Portfolio Tracker</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/premium">Premium Plans</a>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <a href="/learn">Learn Trading</a>
          <a href="/api">API Documentation</a>
          <a href="/blog">Blog</a>
          <a href="/webinars">Webinars</a>
          <a href="/help">Help Center</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/careers">Careers</a>
          <a href="/press">Press Kit</a>
          <a href="/partners">Partners</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/cookies">Cookie Policy</a>
          <a href="/security">Security</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FintechOps. All rights reserved. | Market data delayed by 15 minutes.</p>
        <div className="footer-badges">
          <span>🔒 SSL Secured</span>
          <span>✓ ISO Certified</span>
          <span>⚡ 99.9% Uptime</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

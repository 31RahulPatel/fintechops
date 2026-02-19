import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUserMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo" onClick={closeMenu}>FintechOps</Link>
        
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/home" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/markets" onClick={closeMenu}>Markets</Link></li>
          <li><Link to="/news" onClick={closeMenu}>News</Link></li>
          <li><Link to="/calculators" onClick={closeMenu}>Calculators</Link></li>
          <li><Link to="/portfolio" onClick={closeMenu}>Portfolio</Link></li>
          <li><Link to="/watchlist" onClick={closeMenu}>Watchlist</Link></li>
          <li><Link to="/premium" className="premium-link" onClick={closeMenu}>Premium</Link></li>
        </ul>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="User menu">
                <span className="user-icon">👤</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={closeUserMenu}>Profile</Link>
                  <Link to="/settings" onClick={closeUserMenu}>Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn-signup" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

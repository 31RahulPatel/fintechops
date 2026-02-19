import React, { useState } from 'react';
import { confirmSignUp } from '../services/cognitoService';
import { useNavigate, useLocation } from 'react-router-dom';

const Confirm = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-left">
        <h1>FintechOps Account</h1>
        <p>Verify your email to get started.</p>
      </div>
      <div className="auth-right">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>FINTECHOPS®</span>
          </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/login" className="signup-btn">Login</a>
          </div>
        </div>
        <div className="auth-container">
          <h2>Verify Email</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>We've sent a verification code to <strong>{email}</strong></p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          <div className="links">
            Didn't receive code? <a href="/resend">Resend</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;

import React, { useState } from 'react';
import { signUpWithPhone, signInWithGoogle } from '../services/cognitoService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUpWithPhone(email, email, '', password);
      navigate('/confirm', { state: { email } });
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google signup failed');
    }
  };

  return (
    <>
      <div className="auth-left">
        <h1>FintechOps Account</h1>
        <p>Get access to our products.</p>
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
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, lowercase, number, symbol" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary-btn">Continue</button>
          </form>
          <button onClick={handleGoogleSignup} className="google-btn">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Sign up with Google
          </button>
          <div className="links">Already have an account? <a href="/login">Login</a></div>
        </div>
      </div>
    </>
  );
};

export default Signup;

import React, { useState } from 'react';
import { signUpWithPhone, signInWithGoogle } from '../../../services/cognitoService';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

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
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, lowercase, number, symbol" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️🗨️'}
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

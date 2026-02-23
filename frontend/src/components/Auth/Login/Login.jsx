import React, { useState } from 'react';
import { signInWithGoogle } from '../../../services/cognitoService';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('idToken', data.idToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google login failed');
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
            <a href="/signup" className="signup-btn">Sign Up</a>
          </div>
        </div>
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label>Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="primary-btn">Login</button>
          </form>
          <button onClick={handleGoogleLogin} className="google-btn">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Sign in with Google
          </button>
          <div className="links">
            <a href="/reset">Forgot Password?</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

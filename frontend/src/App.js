import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup/Signup';
import Confirm from './components/Auth/Confirm/Confirm';
import Navbar from './components/Layout/Navbar/Navbar';
import Home from './pages/Home';
import Calculators from './pages/Calculators';
import Stocks from './pages/Stocks/Stocks';
import StockDetail from './pages/Stocks/StockDetail';
import Watchlist from './pages/Watchlist/Watchlist';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<div className="auth-layout"><Login /></div>} />
          <Route path="/signup" element={<div className="auth-layout"><Signup /></div>} />
          <Route path="/confirm" element={<div className="auth-layout"><Confirm /></div>} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/markets" element={
            <ProtectedRoute>
              <Navbar />
              <Stocks />
            </ProtectedRoute>
          } />
          <Route path="/stocks/:symbol" element={
            <ProtectedRoute>
              <Navbar />
              <StockDetail />
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>News Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/calculators" element={
            <ProtectedRoute>
              <Navbar />
              <Calculators />
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>Portfolio Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <Navbar />
              <Watchlist />
            </ProtectedRoute>
          } />
          <Route path="/premium" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>Premium Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

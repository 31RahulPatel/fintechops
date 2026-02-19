import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Confirm from './components/Confirm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/markets" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>Markets Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>News Page - Coming Soon</div>
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
              <div style={{padding: '100px 20px', textAlign: 'center'}}>Watchlist Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/premium" element={
            <ProtectedRoute>
              <Navbar />
              <div style={{padding: '100px 20px', textAlign: 'center'}}>Premium Page - Coming Soon</div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

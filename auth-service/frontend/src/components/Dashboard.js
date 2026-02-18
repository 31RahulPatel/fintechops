import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import { signOut } from '../services/cognitoService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {user && (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaShieldAlt, FaBell, FaCreditCard } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    joinedDate: '',
    isPremium: false
  });
  const [editedUser, setEditedUser] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userInfo = {
      name: userData.name || 'User',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '+91 98765 43210',
      joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      isPremium: userData.isPremium || false
    };
    setUser(userInfo);
    setEditedUser(userInfo);
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setUser(editedUser);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...userData, ...editedUser }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            {user.isPremium && <span className="premium-badge">Premium</span>}
          </div>
        </div>

        <div className="profile-tabs">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <FaUser /> Profile
          </button>
          <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
            <FaShieldAlt /> Security
          </button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
            <FaBell /> Notifications
          </button>
          <button className={activeTab === 'subscription' ? 'active' : ''} onClick={() => setActiveTab('subscription')}>
            <FaCreditCard /> Subscription
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                  <button className="btn-edit" onClick={handleEdit}>
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSave}>
                      <FaSave /> Save
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-fields">
                <div className="field-group">
                  <label><FaUser /> Full Name</label>
                  {isEditing ? (
                    <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>

                <div className="field-group">
                  <label><FaEnvelope /> Email Address</label>
                  <p>{user.email}</p>
                  <span className="field-note">Email cannot be changed</span>
                </div>

                <div className="field-group">
                  <label><FaPhone /> Phone Number</label>
                  {isEditing ? (
                    <input type="tel" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} />
                  ) : (
                    <p>{user.phone}</p>
                  )}
                </div>

                <div className="field-group">
                  <label><FaCalendar /> Member Since</label>
                  <p>{user.joinedDate}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h2>Security Settings</h2>
              <div className="security-options">
                <div className="security-item">
                  <div>
                    <h3>Change Password</h3>
                    <p>Update your password regularly</p>
                  </div>
                  <button className="btn-secondary">Change</button>
                </div>
                <div className="security-item">
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add extra security layer</p>
                  </div>
                  <button className="btn-secondary">Enable</button>
                </div>
                <div className="security-item">
                  <div>
                    <h3>Active Sessions</h3>
                    <p>Manage logged-in devices</p>
                  </div>
                  <button className="btn-secondary">View</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section">
              <h2>Notification Preferences</h2>
              <div className="notification-options">
                <div className="notification-item">
                  <div>
                    <h3>Market Alerts</h3>
                    <p>Significant market movements</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div>
                    <h3>Price Alerts</h3>
                    <p>Target price notifications</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div>
                    <h3>News Updates</h3>
                    <p>Latest financial news</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div>
                    <h3>Newsletter</h3>
                    <p>Weekly market insights</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="profile-section">
              <h2>Subscription Plan</h2>
              <div className="subscription-info">
                {user.isPremium ? (
                  <div className="current-plan premium">
                    <h3>Premium Plan</h3>
                    <p className="plan-price">₹999/month</p>
                    <ul className="plan-features">
                      <li>Real-time market data</li>
                      <li>Advanced analytics</li>
                      <li>Premium recommendations</li>
                      <li>Priority support</li>
                      <li>Ad-free experience</li>
                    </ul>
                    <button className="btn-secondary">Manage</button>
                  </div>
                ) : (
                  <div className="current-plan free">
                    <h3>Free Plan</h3>
                    <p className="plan-price">₹0/month</p>
                    <ul className="plan-features">
                      <li>Basic market data</li>
                      <li>Limited stock info</li>
                      <li>Standard calculators</li>
                    </ul>
                    <button className="btn-primary" onClick={() => navigate('/premium')}>
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

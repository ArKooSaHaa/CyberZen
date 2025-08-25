import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import NavigationBar from '../components/NavigationBar';
import backgroundImage from '../assets/background1101.JPG';

const Profile = () => {
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Clear any other potential auth data
    if (typeof window !== 'undefined') {
      // Clear cookies if any
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
    
    // Navigate to sign in page
    navigate('/signin');
  };



  return (
    <div className="profile-container">
      {/* Background Image */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="background-overlay"></div>

      {/* Emergency Contact */}
      <div className="emergency-contact">
        <span className="emergency-text">Emergency: 999</span>
      </div>

      {/* Navigation Bar */}
      <NavigationBar currentPage="profile" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="profile-container-inner">
            <div className="profile-header">
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">
                Manage your account settings and view your report history.
              </p>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Username:</span>
                    <span className="info-value">Anonymous User</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Account Type:</span>
                    <span className="info-value">Standard</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">2024</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Report Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reports Submitted</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reports Processed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Anonymity Maintained</div>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Account Actions</h3>
                <div className="action-buttons">
                  <button className="action-button" onClick={handleChangePassword}>
                    <span className="action-icon">🔒</span>
                    Change Password
                  </button>
                  
                  <button className="action-button danger">
                    <span className="action-icon">🗑️</span>
                    Delete Account
                  </button>
                  
                  <button className="action-button logout" onClick={handleLogout}>
                    <span className="action-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

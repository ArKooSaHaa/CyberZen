// client/src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import NavigationBar from "../components/NavigationBar";
import backgroundImage from "../assets/background1101.JPG";
import { getMe } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1) Try 'user' from storage (fast path)
    const rawUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (rawUser) {
      try { setUser(JSON.parse(rawUser)); } catch { /* ignore */ }
    }

    // 2) Fetch fresh user from server (authoritative)
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    getMe()
      .then(({ data }) => {
        // always trust server value
        setUser(data);
        // normalize storage: keep only "user"
        localStorage.setItem("user", JSON.stringify(data));
        sessionStorage.removeItem("userData"); // cleanup legacy key
        localStorage.removeItem("userData");
      })
      .catch(() => navigate("/signin"));
  }, [navigate]);

  const handleChangePassword = () => navigate("/change-password");
  const handleLogout = () => {
    // clear all possible auth keys
    ["token", "authToken", "user", "userData"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    sessionStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="profile-container">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="background-overlay" />

      <div className="emergency-contact"><span className="emergency-text">Emergency: 999</span></div>
      <NavigationBar currentPage="profile" />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="profile-container-inner">
            <div className="profile-header">
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">Manage your account settings and view your report history.</p>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{user?.username || "Anonymous User"}</span>
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
                  <div className="stat-item"><div className="stat-number">0</div><div className="stat-label">Reports Submitted</div></div>
                  <div className="stat-item"><div className="stat-number">0</div><div className="stat-label">Reports Processed</div></div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Account Actions</h3>
                <div className="action-buttons">
                  <button className="action-button" onClick={handleChangePassword}><span className="action-icon">🔒</span>Change Password</button>
                  <button className="action-button danger" onClick={() => navigate("/delete-account")}><span className="action-icon">🗑️</span>Delete Account</button>
                  <button className="action-button logout" onClick={handleLogout}><span className="action-icon">🚪</span>Logout</button>
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

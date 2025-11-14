// frontend/TrackNumber.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/TrackNumber.css';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import backgroundImage from '../assets/background1101.JPG';

const TrackNumber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trackNumber, setTrackNumber] = useState('');
  const [error, setError] = useState(false); // To handle the error state

  // Fetch track number passed from the SubmitReport component
  useEffect(() => {
    if (location.state && location.state.trackNumber) {
      setTrackNumber(location.state.trackNumber);
    } else {
      setError(true); // Set error if track number is missing
    }
  }, [location.state]);

  const handleBackToSubmit = () => {
    navigate('/submit-report');
  };

  return (
    <div className="track-number-container">
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
      <NavigationBar currentPage="track-number" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="track-number-container-inner">
            {/* Header */}
            <div className="track-header">
              <h1 className="track-title">Report Submitted Successfully!</h1>
              <p className="track-subtitle">
                Your anonymous report has been received and is being processed securely.
              </p>
            </div>

            {/* Track Number Box */}
            {error ? (
              <div className="track-error-message">
                <p>Track number not found! Please submit your report first.</p>
                <Button
                  text="Back to Submit Report"
                  onClick={handleBackToSubmit}
                  className="back-button"
                />
              </div>
            ) : (
              <>
                <div className="track-number-box">
                  <div className="track-number-label">Track Number</div>
                  <div className="track-number-value">{trackNumber}</div>
                  <div className="track-number-note">
                    Please save this number for future reference.
                  </div>
                </div>

                {/* Action Button */}
                <div className="track-actions">
                  <Button
                    text="Back to Submit Report"
                    onClick={handleBackToSubmit}
                    className="back-button"
                  />
                </div>

                {/* Additional Info */}
                <div className="track-info">
                  <div className="info-item">
                    <span className="info-icon">🔒</span>
                    <span className="info-text">Your report is encrypted and secure</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <span className="info-text">Your identity remains completely anonymous</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📋</span>
                    <span className="info-text">Use this track number to check the report status</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackNumber;

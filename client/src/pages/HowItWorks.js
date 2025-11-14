import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HowItWorks.css';
import NavigationBar from '../components/NavigationBar';
import backgroundImage from '../assets/background1101.JPG';

const HowItWorks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSubmitReport = () => {
    // Navigate to Submit Report page
    navigate('/submit-report');
  };

  return (
    <div className="how-it-works-container">
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
      <NavigationBar currentPage="how-it-works" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="how-it-works-container-inner">
            <div className="how-it-works-header">
              <h1 className="how-it-works-title">How It Works</h1>
              <p className="how-it-works-subtitle">
                Learn how our anonymous reporting system keeps you safe while making your community better.
              </p>
            </div>

            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Submit Your Report</h3>
                  <p>Fill out our secure form with incident details, location, and any supporting images. Your identity remains completely anonymous throughout the process.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Encryption & Processing</h3>
                  <p>Your report is encrypted using military-grade technology and processed through our secure servers. No personal information is ever stored or transmitted.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Anonymous Forwarding</h3>
                  <p>Your report is forwarded to the appropriate authorities without any identifying information. You receive a tracking number to monitor progress.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Action & Resolution</h3>
                  <p>Authorities receive your report and take appropriate action. You can track the status of your report using your unique tracking number.</p>
                </div>
              </div>
            </div>

            <div className="features-section">
              <h2>Key Features</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h4>Complete Anonymity</h4>
                  <p>Your identity is never revealed to anyone, including authorities.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h4>Military-Grade Security</h4>
                  <p>End-to-end encryption ensures your data is always protected.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h4>Instant Processing</h4>
                  <p>Reports are processed and forwarded immediately to relevant authorities.</p>
                </div>

              </div>
            </div>

            <div className="cta-section">
              <h2>Ready to Make a Difference?</h2>
              <p>Start submitting anonymous reports today and help make your community safer.</p>
              <button className="cta-button" onClick={handleSubmitReport}>
                Submit Your First Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;

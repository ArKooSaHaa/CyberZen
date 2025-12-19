import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const TechnicalSupport = () => {
  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="support" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Technical Support</h1>
          <p className="subtitle">We're here to help resolve your technical issues</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>Common Issues & Solutions</h2>
            <div className="support-cards">
              <div className="support-issue">
                <h3>🔌 Connection Problems</h3>
                <p><strong>Issue:</strong> Unable to connect to CyberZens</p>
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Try a different browser</li>
                  <li>Disable VPN temporarily to test</li>
                </ul>
              </div>

                {/* Browser Compatibility card removed per request */}

              <div className="support-issue">
                <h3>📤 Report Submission Issues</h3>
                <p><strong>Issue:</strong> Unable to submit report</p>
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Ensure all required fields are filled</li>
                  <li>Check file size limits (max 25MB)</li>
                  <li>Supported formats: PDF, JPG, PNG, DOC</li>
                  <li>Try submitting smaller files first</li>
                </ul>
              </div>

              <div className="support-issue">
                <h3>🔐 Login Problems</h3>
                <p><strong>Issue:</strong> Cannot log in to account</p>
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Verify your email address and password</li>
                  <li>Use password reset if you forgot your password</li>
                  <li>Check for caps lock when entering password</li>
                  <li>Ensure cookies are enabled</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="page-section">
            <h2>System Requirements</h2>
            <ul>
              <li><strong>Browser:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
              <li><strong>Internet:</strong> Minimum 1 Mbps connection recommended</li>
              <li><strong>Device:</strong> Desktop, Laptop, or Mobile (iOS 12+, Android 8+)</li>
              <li><strong>JavaScript:</strong> Must be enabled</li>
              <li><strong>Cookies:</strong> Must be enabled</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Performance Tips</h2>
            <ul>
              <li>Use a wired connection for faster upload speeds when submitting files</li>
              <li>Close unnecessary browser tabs to improve performance</li>
              <li>Ensure your device has at least 100MB free disk space</li>
              <li>Keep your operating system and browser updated</li>
              <li>Disable browser extensions if experiencing issues</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Still Need Help?</h2>
            <p>
              If none of these solutions work, our technical support team is ready to assist:
            </p>
            <ul>
              <li><strong>Email:</strong> tech-support@cyberzens.com</li>
              <li><strong>Live Chat:</strong> Available 24/7 on this website</li>
              <li><strong>Response Time:</strong> Within 2 hours for urgent issues</li>
              <li><strong>Phone:</strong> +1-XXX-CYBER-ZEN</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Report a Bug</h2>
            <p>
              Found a technical issue? Help us improve by reporting it. Please include:
            </p>
            <ul>
              <li>Description of the issue</li>
              <li>Steps to reproduce the problem</li>
              <li>Your browser and operating system</li>
              <li>Any error messages you received</li>
              <li>Screenshots if possible</li>
            </ul>
            <p>Send bug reports to: bugs@cyberzens.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import Button from '../components/Button';
import NavigationBar from '../components/NavigationBar';
import WaveBackground from '../components/WaveBackground';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
    // Add loading animation
    setIsLoaded(true);
  }, [navigate]);

  const handleMakeReport = () => {
    // Navigate to Submit Report page
    navigate('/submit-report');
  };

  const handleHowItWorks = () => {
    // Navigate to How It Works page
    navigate('/how-it-works');
  };

  return (
    <div className={`homepage-container ${isLoaded ? 'loaded' : ''}`}>
      {/* WebGL Wave Background */}
      <WaveBackground backdropBlurAmount="sm" color="#00FFFF" />

      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Emergency Contact */}
      <div className="emergency-contact">
        <span className="emergency-text">Emergency: 999</span>
      </div>

      {/* Navigation Bar */}
      <NavigationBar currentPage="home" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="main-headline">
                <span className="headline-text">Report Incident.</span>
                <span className="headline-text highlight">Protect Identity.</span>
              </h1>
              
              <p className="hero-subtext">
                Make your community safer without compromising your safety. 
                Our advanced encryption ensures your identity remains completely anonymous.
              </p>

              <div className="cta-buttons">
                <Button
                  text="Make Anonymous Report"
                  onClick={handleMakeReport}
                  className="primary-cta-button"
                />
                
                <Button
                  text="How It Works"
                  onClick={handleHowItWorks}
                  className="secondary-cta-button"
                />
              </div>

              {/* Features Section */}
              <div className="features-section">
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3 className="feature-title">Anonymous Reporting</h3>
                    <p className="feature-description">
                      Your identity is protected with military-grade encryption
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3 className="feature-title">Secure Platform</h3>
                    <p className="feature-description">
                      Built with cutting-edge cybersecurity technology
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3 className="feature-title">Instant Processing</h3>
                    <p className="feature-description">
                      Reports are processed and forwarded immediately
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/support" className="footer-link">Technical Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Security</h4>
            <ul className="footer-links">
              <li><Link to="/security" className="footer-link">Security Policy</Link></li>
              <li><Link to="/encryption" className="footer-link">Encryption</Link></li>
              <li><Link to="/compliance" className="footer-link">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2024 CyberZens. All rights reserved. | Secure • Anonymous • Reliable
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

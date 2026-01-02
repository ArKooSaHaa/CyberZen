import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import Button from "../components/Button";
import WaveBackground from "../components/WaveBackground";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch((err) =>
        console.log("Video autoplay prevented:", err)
      );
    }
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className={`landing-container ${isLoaded ? "loaded" : ""}`}>
      {/* Video Background */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* WebGL Wave Background Overlay */}
      <div className="wave-overlay">
        <WaveBackground backdropBlurAmount="sm" color="#00FFFF" />
      </div>

      {/* Floating Color Orbs */}
      <div className="flowing-colors">
        <div className="color-orb orb-1"></div>
        <div className="color-orb orb-2"></div>
        <div className="color-orb orb-3"></div>
        <div className="color-orb orb-4"></div>
      </div>

      {/* Emergency Contact */}
      <div className="emergency-contact">
        <span className="emergency-text">Emergency: 999</span>
      </div>

      {/* CyberZen Logo */}
      <div className="page-logo">
        <Link to="/" className="logo-link">
          <span className="logo-text">CyberZen</span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="landing-content">
        <div className="content-wrapper">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="main-headline">
                <span className="headline-text">SECURE.</span>
                <span className="headline-text highlight">ANONYMOUS.</span>
                <span className="headline-text">PROTECTED.</span>
              </h1>

              <p className="hero-subtext">
                Report incidents safely and anonymously. Your identity is
                protected with military-grade encryption. Make your community
                safer without compromising your safety.
              </p>

              <div className="cta-buttons">
                <Button
                  text="GET STARTED"
                  onClick={handleGetStarted}
                  className="primary-cta-button"
                />
                <Button
                  text="SIGN IN"
                  onClick={handleSignIn}
                  className="secondary-cta-button"
                />
              </div>

              {/* Features Section */}
              <div className="features-section">
                <h2 className="section-title">WHY CHOOSE CYBERZEN</h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3 className="feature-title">100% Anonymous</h3>
                    <p className="feature-description">
                      Your identity is completely protected. We use advanced
                      encryption to ensure your reports remain anonymous.
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3 className="feature-title">Military-Grade Security</h3>
                    <p className="feature-description">
                      Built with cutting-edge cybersecurity technology. Your data is
                      encrypted and secure.
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">🌐</div>
                    <h3 className="feature-title">24/7 Available</h3>
                    <p className="feature-description">
                      Access our platform anytime, anywhere. Report incidents when
                      you need to, without delay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>



        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="footer-link">
                  Technical Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Security</h4>
            <ul className="footer-links">
              <li>
                <Link to="/security" className="footer-link">
                  Security Policy
                </Link>
              </li>
              <li>
                <Link to="/encryption" className="footer-link">
                  Encryption
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="footer-link">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2024 CyberZen. All rights reserved. | Secure • Anonymous •
            Reliable
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

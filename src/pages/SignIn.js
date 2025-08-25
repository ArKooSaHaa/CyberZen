import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignIn.css';
import InputField from '../components/InputField';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import LinkComponent from '../components/Link';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure video plays and loops
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate that fields are not empty
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Handle admin login
    if (formData.username.toLowerCase() === 'admin' && formData.password.toLowerCase() === 'admin') {
      console.log('Admin login successful');
      navigate('/admin');
      return;
    }
    
    // Handle local user login (any other credentials)
    console.log('Local user login successful:', formData);
    navigate('/home');
  };

  return (
    <div className="signin-container">
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

      {/* Flowing Color Effects */}
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
        <Link to="/home" className="logo-link">
          <span className="logo-text">CyberZen</span>
        </Link>
      </div>

      {/* Main Sign In Form */}
      <div className="signin-form-container">
        <div className="form-background">
          <div className="form-glow-border"></div>
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1 className="form-title">CYBER ACCESS</h1>
              <p className="form-subtitle">Secure Authentication Portal</p>
            </div>

            <div className="form-fields">
              <InputField
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(value) => handleInputChange('username', value)}
                icon="👤"
              />

              <InputField
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                icon="🔒"
              />

              {error && (
                <div className="error-message">
                  <span className="error-text">{error}</span>
                </div>
              )}

              <div className="form-options">
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(checked) => handleInputChange('rememberMe', checked)}
                  label="Remember me"
                />
                <LinkComponent href="/forgot-password" text="Forgot Password?" />
              </div>

              <Button
                type="submit"
                text="SIGN IN"
                onClick={handleSubmit}
                className="signin-button"
              />

              <div className="signup-prompt">
                <span>Don't have an account? </span>
                <Link to="/signup" className="cyber-link">SIGN UP HERE</Link>
              </div>
            </div>
          </form>
        </div>

        {/* Secure Connection Indicator */}
        <div className="secure-connection">
          <div className="secure-indicator">
            <span className="secure-dot"></span>
            <span className="secure-text">SECURE CONNECTION ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Contact.css';
import NavigationBar from '../components/NavigationBar';
import ChatWidget from '../components/ChatWidget';
import backgroundImage from '../assets/background1101.JPG';

const Contact = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@cyberzens.com';
  };

  return (
    <div className="contact-container">
      {/* Background Image */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="background-overlay"></div>

      

      {/* Navigation Bar */}
      <NavigationBar currentPage="contact" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="contact-container-inner">
            <div className="contact-header">
              <h1 className="contact-title">Contact Us</h1>
              <p className="contact-subtitle">
                Get in touch with our support team for assistance and inquiries.
              </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <p>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              </div>
            )}

            <div className="contact-content">
              {/* Support Information */}
              <div className="contact-info">
                <h3>Support Information</h3>
                <div className="contact-item" onClick={handleEmailClick}>
                  <span className="contact-icon">📧</span>
                  <div>
                    <h4>Email Support</h4>
                    <p className="email-link">support@cyberzens.com</p>
                    <span className="click-hint">Click to send email</span>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <div>
                    <h4>Response Time</h4>
                    <p>Within 24 hours</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🔒</span>
                  <div>
                    <h4>Security</h4>
                    <p>All communications are encrypted</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form">
                <h3>Send us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Your message..."
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  {errors.submit && (
                    <div className="error-message submit-error">
                      {errors.submit}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="contact-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
};

export default Contact;

import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since no backend is required, just simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="contact" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="page-body">
          <div className="contact-wrapper">
            <section className="contact-info-section">
              <h2>Get in Touch</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <h3>Email</h3>
                  <p>support@cyberzens.com</p>
                  <small>Response time: Within 24 hours</small>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">🤝</div>
                  <h3>Live Chat</h3>
                  <p>Available 24/7</p>
                  <small>Click the chat icon in the bottom right</small>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <h3>Phone</h3>
                  <p>+1-XXX-CYBER-ZEN</p>
                  <small>Mon-Fri: 9 AM - 6 PM EST</small>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">🏢</div>
                  <h3>Address</h3>
                  <p>Cybersecurity Street</p>
                  <small>Your City, Country 12345</small>
                </div>
              </div>
            </section>

            <section className="contact-form-section">
              <h2>Send us a Message</h2>
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Thank you for your message!</h3>
                  <p>We've received your inquiry and will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1-XXX-XXX-XXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="technical">Technical Support</option>
                      <option value="security">Security Concern</option>
                      <option value="report">Report Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please tell us how we can help..."
                      rows="6"
                    />
                  </div>

                  <button type="submit" className="submit-button">
                    Send Message
                  </button>
                </form>
              )}
            </section>
          </div>

          <section className="page-section">
            <h2>Department Contacts</h2>
            <div className="departments-grid">
              <div className="department-card">
                <h3>Technical Support</h3>
                <p>tech-support@cyberzens.com</p>
                <p>Response time: 2 hours</p>
              </div>
              <div className="department-card">
                <h3>Security & Privacy</h3>
                <p>security@cyberzens.com</p>
                <p>24/7 availability</p>
              </div>
              <div className="department-card">
                <h3>Business & Partnerships</h3>
                <p>business@cyberzens.com</p>
                <p>Response time: 24 hours</p>
              </div>
              <div className="department-card">
                <h3>Legal & Compliance</h3>
                <p>compliance@cyberzens.com</p>
                <p>Response time: 24 hours</p>
              </div>
            </div>
          </section>

          <section className="page-section">
            <h2>Frequently Asked Questions About Contact</h2>
            <ul>
              <li><strong>What's your average response time?</strong> - Most inquiries receive a response within 24 hours</li>
              <li><strong>Is live chat really available 24/7?</strong> - Yes, our live chat support is available round the clock</li>
              <li><strong>What if I have a security issue?</strong> - Contact security@cyberzens.com immediately. We have a dedicated security team</li>
              <li><strong>Can I schedule a call?</strong> - Yes, include that request in your message and we'll coordinate</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

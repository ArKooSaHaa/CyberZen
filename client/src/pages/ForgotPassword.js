import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import PasswordField from '../components/PasswordField';
import InputField from '../components/InputField';
import Button from '../components/Button';
import '../styles/ProfessionalPage.css';
import { resetPasswordWithFirebase } from '../services/firebaseAuth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithFirebase(email);
      setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
      // Optionally redirect to sign-in after a short delay
      setTimeout(() => {
        navigate('/signin', { state: { message: 'Password reset email sent. Check your inbox.' } });
      }, 3500);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="forgot" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Reset Your Password</h1>
          <p className="subtitle">Enter the email associated with your account and we'll send a reset link.</p>
        </div>

        <div className="page-body">
          <section className="page-section" style={{ maxWidth: 600, margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <InputField
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(v) => setEmail(v)}
                  label="Email Address"
                />
              </div>

              {error && <div className="error-message" style={{ marginBottom: 12 }}>{error}</div>}
              {message && <div className="success-message" style={{ marginBottom: 12 }}>{message}</div>}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Button type="button" text="Cancel" className="secondary-cta-button" onClick={() => navigate('/signin')} />
                <Button type="submit" text={loading ? 'Sending...' : 'Send Reset Email'} className="primary-cta-button" disabled={loading} />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

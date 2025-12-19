import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";

import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import LinkComponent from "../components/Link";
import ApiConfigPrompt from "../components/ApiConfigPrompt";

import { signUp } from "../services/api";
import { signUpWithFirebase, sendVerificationEmail, reloadFirebaseUser } from "../services/firebaseAuth";
import { useNavigate } from "react-router-dom";

const initialState = {
  firstName: "",
  lastName: "",
  nidNumber: "",
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const SignUp = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(""); // success mesaage return korbe
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.nidNumber.trim()) newErrors.nidNumber = "NID number is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    // Email format hoitese
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password rules
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const email = formData.email.trim();
      const password = formData.password;
      
      // Additional user data
      const additionalData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nidNumber: formData.nidNumber.trim(),
        username: formData.username.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      };

      console.log('🔥 Starting signup process...');
      
      // Step 1: Create user in Firebase Authentication (for email verification)
      let firebaseResult = null;
      let firebaseError = null;
      
      try {
        console.log('🔥 Creating Firebase Auth user...');
        firebaseResult = await signUpWithFirebase(email, password, additionalData);
        console.log('✅ Firebase signup successful:', firebaseResult.user.uid);
      } catch (firebaseErr) {
        console.error('❌ Firebase signup failed:', firebaseErr);
        firebaseError = firebaseErr;
        // Continue to MongoDB storage - we'll handle Firebase error later
      }
      
      // Step 2: Save ALL user data to MongoDB (REQUIRED - primary storage)
      // MongoDB is the source of truth for all user data
      const payload = {
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        nid: additionalData.nidNumber, // Map nidNumber to nid
        nidNumber: additionalData.nidNumber, // Keep both for compatibility
        username: additionalData.username,
        email: email,
        phone: additionalData.phoneNumber, // Map phoneNumber to phone
        phoneNumber: additionalData.phoneNumber, // Keep both for compatibility
        password: password, // Backend will hash this
        confirmPassword: formData.confirmPassword,
        ...(firebaseResult && { 
          firebaseUid: firebaseResult.user.uid, // Store Firebase UID if available
          emailVerified: firebaseResult.user.emailVerified // Store verification status
        })
      };

      console.log('💾 Saving user data to MongoDB...');
      
      try {
        // CRITICAL: Store user in MongoDB (this is required)
        const { data } = await signUp(payload);
        console.log('✅ User data saved to MongoDB:', data._id);
        
        // Store user email for verification UI
        setUserEmail(email);
        if (firebaseResult) {
          setVerificationSent(firebaseResult.verificationEmailSent);
        }
        
        // Show success message
        if (firebaseResult) {
          setMsg(`✅ Account created successfully! Please check your email (${email}) and verify your account to complete registration.`);
        } else if (firebaseError) {
          setMsg(`⚠️ Account created in database, but email verification setup failed. ${firebaseError.message}. Please contact support.`);
        } else {
          setMsg(`✅ Account created successfully! Welcome, ${data.firstName || data.username}.`);
        }
      } catch (backendErr) {
        console.error('❌ MongoDB storage failed:', backendErr);
        
        // If MongoDB fails, we should delete Firebase user if it was created
        if (firebaseResult && firebaseResult.firebaseUser) {
          try {
            // Try to delete Firebase user if MongoDB save failed
            // Note: Firebase Admin SDK is needed for this, but for now we'll just log
            console.error('⚠️ MongoDB save failed but Firebase user was created. Manual cleanup may be needed.');
          } catch (cleanupErr) {
            console.error('❌ Failed to cleanup Firebase user:', cleanupErr);
          }
        }
        
        // Show error - MongoDB storage is required
        const errorMsg = backendErr?.response?.data?.message || backendErr.message || "Failed to save user data. Please try again.";
        setMsg(`❌ ${errorMsg}`);
        setLoading(false);
        return; // Stop here if MongoDB save fails
      }
      
    } catch (err) {
      console.error('❌ Signup error:', err);
      const m = err.message || err?.response?.data?.message || "Signup failed";
      setMsg(m);
      
      // Set specific field errors for better UX
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered. Please sign in instead.' });
      } else if (err.code === 'auth/invalid-email') {
        setErrors({ email: 'Please enter a valid email address.' });
      } else if (err.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak. Please use at least 6 characters.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const openTermsInNewTab = () => window.open("/terms-of-service", "_blank");
  const openPrivacyInNewTab = () => window.open("/privacy-policy", "_blank");

  const handleResendVerification = async () => {
    if (!userEmail) return;
    
    setResendingEmail(true);
    try {
      await sendVerificationEmail();
      setMsg(`✅ Verification email sent! Please check ${userEmail} and click the verification link.`);
      setVerificationSent(true);
    } catch (err) {
      setMsg(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const updatedUser = await reloadFirebaseUser();
      if (updatedUser.emailVerified) {
        setMsg('✅ Email verified successfully! Your account is now active. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setMsg('⚠️ Email not yet verified. Please check your email and click the verification link.');
      }
    } catch (err) {
      setMsg('Please sign in to check verification status.');
    }
  };

  return (
    <div className="signup-container">
      {/* Video Background */}
      <div className="video-background">
        <video ref={videoRef} autoPlay loop muted playsInline className="background-video">
          <source src="/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
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

      {/* Main Sign Up Form */}
      <ApiConfigPrompt />
      <div className="signup-form-container">
        <div className="form-background">
          <div className="form-glow-border"></div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1 className="form-title">CYBER REGISTRATION</h1>
              <p className="form-subtitle">Create Your Secure Account</p>
            </div>

            <div className="form-fields">
              {/* Personal Information */}
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="field-row">
                  <InputField
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    
                    error={errors.firstName}
                    label="First Name"
                  />
                  <InputField
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    
                    error={errors.lastName}
                    label="Last Name"
                  />
                </div>
                <InputField
                  type="text"
                  placeholder="Enter NID number"
                  value={formData.nidNumber}
                  onChange={(value) => handleInputChange("nidNumber", value)}
                  
                  error={errors.nidNumber}
                  label="NID Number"
                />
              </div>

              {/* Account Information */}
              <div className="form-section">
                <h3 className="section-title">Account Information</h3>
                <InputField
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(value) => handleInputChange("username", value)}
                  
                  error={errors.username}
                  label="Username"
                />
                <InputField
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  
                  error={errors.email}
                  label="Email Address"
                />
                <InputField
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  
                  error={errors.phoneNumber}
                  label="Phone Number"
                />
              </div>

              {/* Password Section */}
              <div className="form-section">
                <h3 className="section-title">Security</h3>
                <PasswordField
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  label="Password"
                />
                <PasswordField
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(value) => handleInputChange("confirmPassword", value)}
                  error={errors.confirmPassword}
                  label="Confirm Password"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="form-section">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={(checked) => handleInputChange("agreeToTerms", checked)}
                  label={
                    <span>
                      I agree to the{" "}
                      <LinkComponent href="/terms-of-service" text="Terms of Service" onClick={openTermsInNewTab} />
                      {" "}and{" "}
                      <LinkComponent href="/privacy-policy" text="Privacy Policy" onClick={openPrivacyInNewTab} />
                    </span>
                  }
                  error={errors.agreeToTerms}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                text={loading ? "CREATING..." : "CREATE ACCOUNT"}
                className="signup-button"
                disabled={loading}
              />

              {msg && (
                <div className={`submit-message ${msg.includes('failed') || msg.includes('already') || msg.includes('required') || msg.includes('match') || msg.includes('not yet') ? 'error' : ''}`} role="alert">
                  {msg}
                </div>
              )}

              {/* Email Verification Section */}
              {verificationSent && userEmail && (
                <div className="verification-section" style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#f0f8ff',
                  border: '1px solid #4a90e2',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#4a90e2' }}>📧 Verification Email Sent!</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#333', marginBottom: '15px' }}>
                    We've sent a verification email to <strong>{userEmail}</strong>
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: resendingEmail ? '#ccc' : '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: resendingEmail ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {resendingEmail ? 'Sending...' : '📨 Resend Verification Email'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCheckVerification}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✓ I've Verified My Email
                    </button>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
                    Didn't receive the email? Check your spam folder or resend it above.
                  </p>
                </div>
              )}

              <div className="signin-prompt">
                <span>Already have an account? </span>
                <Link to="/signin" className="cyber-link">
                  SIGN IN HERE
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Secure Registration Indicator */}
        <div className="secure-registration">
          <div className="secure-indicator">
            <span className="secure-dot"></span>
            <span className="secure-text">SECURE REGISTRATION PROCESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

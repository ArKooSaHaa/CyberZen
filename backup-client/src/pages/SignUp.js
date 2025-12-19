import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";

import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import LinkComponent from "../components/Link";

import { signUp } from "../services/api";

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
  const videoRef = useRef(null);

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

    if (!validateForm()) return;

    setLoading(true);
    try {
      // backend er sathe connect hoitesee
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nid: formData.nidNumber.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phoneNumber.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };


      // axios return korbe
      const { data } = await signUp(payload);
      setMsg(`Account created for ${data.firstName || data.username}.`);
    } catch (err) {
      const m = err?.response?.data?.message || err.message || "Signup failed";
      setMsg(m);
    } finally {
      setLoading(false);
    }
  };

  const openTermsInNewTab = () => window.open("/terms-of-service", "_blank");
  const openPrivacyInNewTab = () => window.open("/privacy-policy", "_blank");

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
                 <div className={`submit-message ${msg.includes('failed') || msg.includes('already') || msg.includes('required') || msg.includes('match') ? 'error' : ''}`} role="alert">
                   {msg}
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

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/SignIn.css";
import InputField from "../components/InputField";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import LinkComponent from "../components/Link";
import { signIn } from "../services/api";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) =>
        console.log("Video autoplay prevented:", err)
      );
    }
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = formData.username.trim();
    const password = formData.password;

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await signIn({ username, password });
      const { data } = response;

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Clear any existing tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Save token depending on rememberMe
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      // ✅ Always navigate after storing the token
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Sign in failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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

            {successMessage && (
              <div className="success-message">
                <span className="success-text">{successMessage}</span>
              </div>
            )}

            <div className="form-fields">
              <InputField
                type="text"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={(value) => handleInputChange("username", value)}
                
                autoComplete="username"
              />

              <InputField
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                
                autoComplete="current-password"
              />

              {error && (
                <div className="error-message">
                  <span className="error-text">{error}</span>
                </div>
              )}

              <div className="form-options">
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(checked) => handleInputChange("rememberMe", checked)}
                  label="Remember me"
                />
                <LinkComponent href="/forgot-password" text="Forgot Password?" />
              </div>

              <Button
                type="submit"
                text={loading ? "SIGNING IN..." : "SIGN IN"}
                className="signin-button"
                disabled={loading}
              />
            </div>

            <div className="signup-prompt">
              <span>Don't have an account? </span>
              <Link to="/signup" className="cyber-link">
                SIGN UP HERE
              </Link>
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

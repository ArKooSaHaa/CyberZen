import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/SignIn.css";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import LinkComponent from "../components/Link";
import { signIn, updateEmailVerified } from "../services/api";
import { signInWithFirebase, reloadFirebaseUser } from "../services/firebaseAuth";

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

      console.log('🔥 Starting sign-in process...');
      
      // Determine if username is an email (Firebase Auth uses email)
      // Firebase Auth uses email/password, so if it's an email, try Firebase first
      const isEmail = username.includes("@");
      let email = username;
      
      // Step 1: Try Firebase Authentication first (if it's an email)
      let firebaseResult = null;
      let backendResult = null;
      
      if (isEmail) {
        try {
          console.log('🔥 Attempting Firebase sign-in...');
          firebaseResult = await signInWithFirebase(email, password);
          
          // Check if email is verified
          if (firebaseResult.user && !firebaseResult.user.emailVerified) {
            // Reload user to get latest verification status
            const updatedUser = await reloadFirebaseUser();
            if (!updatedUser.emailVerified) {
              setError("Please verify your email before signing in. Check your inbox for the verification link.");
              setLoading(false);
              return;
            }
            firebaseResult.user.emailVerified = true;
          }
          
          console.log('✅ Firebase sign-in successful:', firebaseResult.user.uid);
        } catch (firebaseErr) {
          console.log('⚠️ Firebase sign-in failed:', firebaseErr.message);
          // If Firebase sign-in fails, try backend as fallback
          if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/wrong-password') {
            // User might be an old user (not in Firebase), try backend
            console.log('⚠️ User not found in Firebase, trying backend...');
          } else {
            // For other Firebase errors, still try backend as fallback
            console.log('⚠️ Firebase error, trying backend as fallback...');
          }
        }
      }
      
      // Step 2: Try backend API (either as primary for username, or as fallback)
      // Include emailVerified from Firebase if available
      try {
        console.log('🔄 Attempting backend sign-in...');
        const loginPayload = { username, password };
        if (firebaseResult && firebaseResult.user?.emailVerified !== undefined) {
          loginPayload.emailVerified = firebaseResult.user.emailVerified;
          console.log(`📧 Including emailVerified status: ${firebaseResult.user.emailVerified}`);
        }
        const response = await signIn(loginPayload);
        backendResult = response;
        console.log('✅ Backend sign-in successful');
      } catch (backendErr) {
        console.log('⚠️ Backend sign-in failed:', backendErr.message);
        
        // If both Firebase and backend failed
        if (!firebaseResult) {
          throw new Error(backendErr.message || "Invalid credentials. Please check your username/email and password.");
        }
        // If Firebase succeeded but backend failed, continue with Firebase user
      }
      
      // Step 3: Determine which result to use
      let userData = null;
      let token = null;
      
      if (firebaseResult) {
        // Use Firebase result (preferred for new users)
        token = firebaseResult.token;
        userData = {
          _id: firebaseResult.user.uid,
          email: firebaseResult.user.email,
          username: firebaseResult.user.displayName || firebaseResult.user.email.split('@')[0],
          emailVerified: firebaseResult.user.emailVerified,
          // Try to get additional data from backend if available
          ...(backendResult?.data?.user || {})
        };
        console.log('✅ Using Firebase authentication');
        
        // If email is verified in Firebase, update MongoDB
        if (firebaseResult.user.emailVerified && firebaseResult.user.email) {
          try {
            console.log('📧 Updating emailVerified in MongoDB...');
            await updateEmailVerified({ 
              email: firebaseResult.user.email, 
              emailVerified: true 
            });
            console.log('✅ Email verification status synced to MongoDB');
          } catch (updateErr) {
            console.warn('⚠️ Failed to update emailVerified in MongoDB:', updateErr.message);
            // Don't block login if this fails
          }
        }
      } else if (backendResult) {
        // Use backend result (for old users not in Firebase)
        token = backendResult.data.token;
        userData = backendResult.data.user;
        console.log('✅ Using backend authentication');
      } else {
        throw new Error("Invalid credentials. Please check your username/email and password.");
      }

      if (!token) {
        throw new Error("No token received");
      }

      // Clear any existing tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Save token depending on rememberMe
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(userData));

      console.log('✅ Sign-in successful, redirecting...');
      // ✅ Always navigate after storing the token
      navigate("/home");
    } catch (err) {
      console.error('❌ Sign-in error:', err);
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
                placeholder="Enter your email or username"
                value={formData.username}
                onChange={(value) => handleInputChange("username", value)}
                
                autoComplete="username"
              />

              <PasswordField
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

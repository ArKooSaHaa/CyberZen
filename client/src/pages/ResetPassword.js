import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { confirmPasswordReset } from "../services/firebaseAuth";
import axios from "axios";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate inputs
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!newPassword) {
      setError("New password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Normalize email (lowercase and trim) before sending to backend
      const normalizedEmail = email.toLowerCase().trim();

      // Get the reset code from URL if available
      const oobCode = searchParams.get("oobCode");
      let firebaseUpdated = false;

      // Step 1: If we have a Firebase reset code, update Firebase password first
      if (oobCode) {
        try {
          console.log("🔄 Updating Firebase password...");
          await confirmPasswordReset(oobCode, newPassword);
          firebaseUpdated = true;
          console.log("✅ Firebase password reset confirmed");
        } catch (firebaseError) {
          console.error("❌ Firebase reset error:", firebaseError);
          setError(
            firebaseError.message || "Invalid or expired reset link. Please request a new password reset."
          );
          setLoading(false);
          return;
        }
      }

      // Step 2: Always update MongoDB password (whether Firebase was updated or not)
      // This ensures MongoDB password is synchronized with Firebase
      try {
        console.log("🔄 Updating MongoDB password...");
        const response = await axios.post("/api/users/reset-password", {
          email: normalizedEmail,
          newPassword,
          firebaseVerified: firebaseUpdated,
        });

        if (response.status === 200 || response.status === 201) {
          console.log("✅ MongoDB password updated successfully");
          
          if (firebaseUpdated) {
            setMessage("✅ Password reset successfully in both Firebase and MongoDB! Redirecting to login...");
          } else {
            setMessage("✅ Password reset successfully in MongoDB! Redirecting to login...");
          }
          
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          throw new Error("Failed to update password in MongoDB");
        }
      } catch (mongoError) {
        console.error("❌ MongoDB update error:", mongoError);
        
        // If Firebase was updated but MongoDB failed, warn the user
        if (firebaseUpdated) {
          setError(
            "⚠️ Password was updated in Firebase but failed to update in MongoDB. " +
            "Please contact support or try logging in with Firebase authentication. " +
            (mongoError.response?.data?.message || mongoError.message)
          );
        } else {
          const errorMsg =
            mongoError.response?.data?.message ||
            mongoError.message ||
            "Failed to update password in MongoDB. Please try again.";
          setError(errorMsg);
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("❌ Unexpected error during password reset:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while resetting your password.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1>Reset Your Password</h1>
        <p>Enter your email and new password to complete the reset process.</p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleResetPassword}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordField
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <PasswordField
            label="Confirm Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            text={loading ? "Resetting..." : "Reset Password"}
          />
        </form>

        <p className="signin-link">
          Remember your password?{" "}
          <a onClick={() => navigate("/signin")} style={{ cursor: "pointer", color: "#007bff" }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

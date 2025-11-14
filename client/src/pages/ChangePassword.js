// client/src/pages/ChangePassword.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.css";
import NavigationBar from "../components/NavigationBar";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import backgroundImage from "../assets/background1101.JPG";
import { changePassword } from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (msg) setMsg("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters long";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword))
      newErrors.newPassword = "Must include uppercase, lowercase, and a number";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your new password";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMsg("");
    setErrors({});

    try {
      const response = await changePassword({
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setMsg("Password changed successfully!");
      
      // Clear form
      setFormData({
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Navigate to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Failed to change password. Please try again.";
      setErrors((prev) => ({ ...prev, submit: message }));
      setMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/profile");

  return (
    <div className="change-password-container">
      {/* Background Image */}
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="background-overlay"></div>

      {/* Emergency Contact */}
      <div className="emergency-contact">
        <span className="emergency-text">Emergency: 999</span>
      </div>

      {/* Navigation Bar */}
      <NavigationBar currentPage="profile" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="change-password-container-inner">
            <div className="change-password-header">
              <h1 className="change-password-title">Change Password</h1>
              <p className="change-password-subtitle">Update your password to keep your account secure.</p>
            </div>

            <form className="change-password-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Password Information</h3>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Enter your username"
                    className="form-input"
                  />
                  {errors.username && <div className="error-message">{errors.username}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <PasswordField
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(v) => handleInputChange("currentPassword", v)}
                    placeholder="Enter your current password"
                    error={errors.currentPassword}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <PasswordField
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(v) => handleInputChange("newPassword", v)}
                    placeholder="Enter your new password"
                    error={errors.newPassword}
                  />
                  <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                      <li className={formData.newPassword.length >= 8 ? "met" : "not-met"}>At least 8 characters</li>
                      <li className={/(?=.*[a-z])/.test(formData.newPassword) ? "met" : "not-met"}>One lowercase letter</li>
                      <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? "met" : "not-met"}>One uppercase letter</li>
                      <li className={/(?=.*\d)/.test(formData.newPassword) ? "met" : "not-met"}>One number</li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <PasswordField
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(v) => handleInputChange("confirmPassword", v)}
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword}
                  />
                </div>
              </div>

              {errors.submit && <div className="error-message">{errors.submit}</div>}
              {msg && <div className="success-message">{msg}</div>}

              <div className="form-actions">
                <Button text="Cancel" onClick={handleCancel} className="secondary-button" type="button" />
                <Button
                  text={isSubmitting ? "Updating..." : "Update Password"}
                  className="primary-button"
                  type="submit"              // submit via form only (no onClick to avoid double)
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;

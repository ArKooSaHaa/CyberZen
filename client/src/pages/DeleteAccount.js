import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DeleteAccount.css";
import NavigationBar from "../components/NavigationBar";
import backgroundImage from "../assets/background1101.JPG";
import { deleteAccount } from "../services/api";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    reason: "",
    confirmDelete: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.confirmDelete) {
      setError("You must confirm that you want to delete your account");
      return;
    }

    setIsLoading(true);

    // delete acc er api call hoitese
    try {
      await deleteAccount({ 
        password: formData.password, 
        reason: formData.reason 
      });
      
      // Clear all user data
      ["token", "authToken", "user", "userData"].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
      sessionStorage.clear();

      
      navigate("/signin", { 
        state: { message: "Your account has been successfully deleted." }
      });
    } catch (err) {
      setError(err.message || "Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="delete-account-container">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="background-overlay" />
      <NavigationBar currentPage="profile" />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="delete-account-container-inner">
            <div className="delete-account-header">
              <h1 className="delete-account-title">Delete Account</h1>
              <p className="delete-account-subtitle">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>

            <div className="warning-section">
              <div className="warning-icon">⚠️</div>
              <h3>Important Warning</h3>
              <ul>
                <li>All your submitted reports will be permanently deleted</li>
                <li>Your account information will be completely removed</li>
                <li>This action cannot be reversed</li>
                <li>You will need to create a new account if you want to use the service again</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="delete-account-form">
              <div className="form-group">
                <label htmlFor="password">Current Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Deletion (Optional)</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please let us know why you're deleting your account..."
                  rows="3"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="confirmDelete"
                    checked={formData.confirmDelete}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="checkmark"></span>
                  I understand that this action is permanent and cannot be undone
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="delete-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteAccount;

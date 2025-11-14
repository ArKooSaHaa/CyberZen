import React, { useState } from 'react';
import './PasswordField.css';

const PasswordField = ({ 
  placeholder, 
  value, 
  onChange, 
  error, 
  label,
  className = '' 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`password-field-container ${className} ${error ? 'error' : ''}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="password-input-wrapper">
        
        <input
          type={showPassword ? 'text' : 'password'}
          className="password-field"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
        <div className="input-glow"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PasswordField;

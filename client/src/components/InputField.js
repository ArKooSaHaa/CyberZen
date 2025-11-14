import React from 'react';
import './InputField.css';

const InputField = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon, 
  className = '',
  error,
  label
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`input-field-container ${className} ${error ? 'error' : ''}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <div className="input-glow"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;

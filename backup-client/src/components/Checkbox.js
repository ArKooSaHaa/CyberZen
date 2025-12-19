import React from 'react';
import './Checkbox.css';

const Checkbox = ({ checked, onChange, label, description, className = '', error }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div className={`checkbox-container ${className} ${error ? 'error' : ''}`}>
      <div className="checkbox-content" onClick={handleClick}>
        <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>
          {checked && <span className="checkmark">✓</span>}
        </div>
        <div className="checkbox-text">
          <span className="checkbox-label">{label}</span>
          {description && <span className="checkbox-description">{description}</span>}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Checkbox;

import React from 'react';
import './Button.css';

const Button = ({ 
  text, 
  onClick, 
  type = 'button', 
  className = '',
  disabled = false 
}) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`cyber-button ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="button-text">{text}</span>
      <div className="button-glow"></div>
    </button>
  );
};

export default Button;

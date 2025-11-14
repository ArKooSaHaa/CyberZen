import React from 'react';
import './Link.css';

const Link = ({ href, text, className = '', onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a 
      href={href} 
      className={`cyber-link ${className}`}
      onClick={handleClick}
    >
      {text}
    </a>
  );
};

export default Link;

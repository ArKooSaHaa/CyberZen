import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/home" className="logo-link">
            <span className="logo-text">CyberZen</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/submit-report" 
            className={`nav-link ${currentPage === 'submit-report' ? 'active' : ''}`} 
            onClick={closeMenu}
          >
            Submit Report
          </Link>
          <Link 
            to="/track-report" 
            className={`nav-link ${currentPage === 'track-report' ? 'active' : ''}`} 
            onClick={closeMenu}
          >
            Track Report
          </Link>
          <Link 
            to="/how-it-works" 
            className={`nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`} 
            onClick={closeMenu}
          >
            How It Works
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`} 
            onClick={closeMenu}
          >
            My Profile
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`} 
            onClick={closeMenu}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/hotels" className="footer-link">Hotels</Link>
          <Link to="/login" className="footer-link">Login</Link>
        </div>
        <div className="footer-info">
          <p>&copy; 2025 StaySphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
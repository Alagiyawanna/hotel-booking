import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/hotels" className="footer-link">Hotels</a>
          <a href="/login" className="footer-link">Login</a>
        </div>
        <div className="footer-info">
          <p>&copy; 2025 MyHotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
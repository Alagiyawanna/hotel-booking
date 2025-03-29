import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Add event listener for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V17C9 16.4696 9.21071 15.9609 9.58579 15.5858C9.96086 15.2107 10.4696 15 11 15H13C13.5304 15 14.0391 15.2107 14.4142 15.5858C14.7893 15.9609 15 16.4696 15 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="9" r="4" fill="#22c55e" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>StaySphere</span>
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </button>
        
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/hotels" className="nav-links" onClick={() => setMenuOpen(false)}>
              Hotels
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
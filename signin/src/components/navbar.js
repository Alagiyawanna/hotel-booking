import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StaySphere
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/hotels" className="nav-links">
              Hotels
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-links">
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links">
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
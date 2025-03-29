import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchBookings(token);
  }, [navigate]);

  const fetchBookings = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your bookings. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh bookings after cancellation
      fetchBookings(token);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        
        {user && (
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        )}
        
        <div className="profile-bookings">
          <h2>Your Bookings</h2>
          {error && <div className="error-message">{error}</div>}
          
          {bookings.length === 0 ? (
            <p className="no-bookings">You don't have any bookings yet.</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-hotel">
                    <img 
                      src={booking.hotel.image || 'https://via.placeholder.com/100'} 
                      alt={booking.hotel.name} 
                      className="booking-image" 
                    />
                    <div className="booking-details">
                      <h3>{booking.hotel.name}</h3>
                      <p className="booking-location">{booking.hotel.location}</p>
                      <p className="booking-price">${booking.hotel.price} / night</p>
                    </div>
                  </div>
                  
                  <div className="booking-info">
                    <p><strong>Check-in:</strong> {formatDate(booking.checkIn)}</p>
                    <p><strong>Check-out:</strong> {formatDate(booking.checkOut)}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                    <p className={`booking-status ${booking.status}`}>
                      <strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </p>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <button 
                      className="cancel-button" 
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
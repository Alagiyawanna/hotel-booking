import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendBookingId, setExtendBookingId] = useState(null);
  const [newCheckOut, setNewCheckOut] = useState('');
  const [extendingStay, setExtendingStay] = useState(false);
  const [extendError, setExtendError] = useState('');
  const [currentCheckOut, setCurrentCheckOut] = useState('');
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

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
  
  const openExtendModal = (bookingId, currentCheckOutDate) => {
    setExtendBookingId(bookingId);
    setCurrentCheckOut(currentCheckOutDate);
    // Set minimum date for extension to one day after current checkout
    const minDate = new Date(currentCheckOutDate);
    minDate.setDate(minDate.getDate() + 1);
    setNewCheckOut(minDate.toISOString().split('T')[0]);
    setShowExtendModal(true);
    setExtendError('');
  };
  
  const closeExtendModal = () => {
    setShowExtendModal(false);
    setExtendBookingId(null);
    setNewCheckOut('');
    setExtendError('');
  };
  
  const handleExtendStay = async () => {
    if (!newCheckOut) {
      setExtendError('Please select a new check-out date');
      return;
    }
    
    // Validate new date is after current checkout
    const newDate = new Date(newCheckOut);
    const currentDate = new Date(currentCheckOut);
    
    if (newDate <= currentDate) {
      setExtendError('New check-out date must be after current check-out date');
      return;
    }
    
    try {
      setExtendingStay(true);
      const token = localStorage.getItem('token');
      
      await axios.patch(
        `http://localhost:5000/api/bookings/${extendBookingId}/extend`, 
        { newCheckOut }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Success - close modal and refresh bookings
      setExtendingStay(false);
      closeExtendModal();
      fetchBookings(token);
      alert('Your stay has been extended successfully!');
    } catch (err) {
      setExtendingStay(false);
      setExtendError(err.response?.data?.message || 'Failed to extend stay. Please try again.');
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <div className="loader"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-page">
    
    {/* Profile Header with background */}
    <div className="profile-header-section">
      <div className="container">
        <h1>Your Profile</h1>
        <p>Manage your bookings and account settings</p>
      </div>
    </div>
    
    <div className="profile-container">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">↪</span> Logout
          </button>
        </div>
        
        {user && (
          <div className="profile-info">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
        )}
        
        <div className="profile-bookings">
          <div className="bookings-header">
            <h2>Your Bookings</h2>
            <div className="booking-tabs">
              <button 
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmed
              </button>
              <button 
                className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">🏨</div>
              <h3>No Bookings Found</h3>
              <p>You haven't made any bookings yet. Start exploring hotels to plan your next stay!</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">🔍</div>
              <h3>No {activeTab} Bookings</h3>
              <p>You don't have any {activeTab} bookings at the moment.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className={`booking-card ${booking.status}`}>
                  <div className="booking-hotel">
                    <img 
                      src={booking.hotel.image || 'https://via.placeholder.com/100'} 
                      alt={booking.hotel.name} 
                      className="booking-image" 
                    />
                    <div className="booking-details">
                      <div className="booking-name-status">
                        <h3>{booking.hotel.name}</h3>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="booking-location">{booking.hotel.location}</p>
                      <div className="booking-price-nights">
                        <p className="booking-price">${booking.hotel.price} / night</p>
                        <p className="booking-nights">
                          {calculateNights(booking.checkIn, booking.checkOut)} nights
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-info">
                    <div className="booking-dates">
                      <div className="date-item">
                        <span className="date-label">Check-in</span>
                        <span className="date-value">{formatDate(booking.checkIn)}</span>
                      </div>
                      <div className="date-separator">→</div>
                      <div className="date-item">
                        <span className="date-label">Check-out</span>
                        <span className="date-value">{formatDate(booking.checkOut)}</span>
                      </div>
                    </div>
                    
                    <div className="booking-meta">
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span className="meta-value">{booking.guests} guests</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">💰</span>
                        <span className="meta-value">
                          Total: ${booking.hotel.price * calculateNights(booking.checkIn, booking.checkOut)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button 
                        className="extend-button" 
                        onClick={() => openExtendModal(booking._id, booking.checkOut)}
                      >
                        <span className="button-icon">📅</span> Extend Stay
                      </button>
                      <button 
                        className="cancel-button" 
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        <span className="button-icon">✕</span> Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Extend Stay Modal */}
        {showExtendModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Extend Your Stay</h2>
              
              {extendError && <div className="error-message">{extendError}</div>}
              
              <div className="form-group">
                <label>Current Check-out Date:</label>
                <p className="current-date">{formatDate(currentCheckOut)}</p>
              </div>
              
              <div className="form-group">
                <label>New Check-out Date:</label>
                <input 
                  type="date" 
                  value={newCheckOut} 
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  min={new Date(currentCheckOut).toISOString().split('T')[0]}
                  required
                  className="date-picker"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-modal-button" 
                  onClick={closeExtendModal}
                  disabled={extendingStay}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-button" 
                  onClick={handleExtendStay}
                  disabled={extendingStay}
                >
                  {extendingStay ? 
                    <><span className="spinner"></span> Processing...</> : 
                    'Extend Stay'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
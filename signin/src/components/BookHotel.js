import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import './BookHotel.css';
import config from '../config';

const BookHotel = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch hotel details
    fetchHotel();
  }, [hotelId, navigate]);

  // Calculate total price whenever dates or hotel data changes
  useEffect(() => {
    if (hotel && checkIn && checkOut) {
      calculateTotalPrice();
    } else {
      setTotalPrice(0);
      setNights(0);
    }
  }, [hotel, checkIn, checkOut]);
  
  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/hotels`)
        .catch((err) => {
          console.error("Error fetching all hotels:", err);
          return { data: [] };
        });
      
      // Find the specific hotel by ID
      const hotelData = Array.isArray(response.data) 
        ? response.data.find(h => h._id === hotelId) 
        : null;
      
      if (hotelData) {
        console.log("Found hotel:", hotelData);
        setHotel(hotelData);
      } else {
        setError('Hotel not found');
        console.error("Hotel not found with ID:", hotelId);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error in fetchHotel:", err);
      setError('Failed to load hotel details');
      setLoading(false);
    }
  };
  
  const calculateTotalPrice = () => {
    if (!hotel || !checkIn || !checkOut) {
      setTotalPrice(0);
      setNights(0);
      return;
    }
    
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Ensure valid dates
      if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        console.log("Invalid dates");
        setTotalPrice(0);
        setNights(0);
        return;
      }
      
      // Calculate nights (ensure at least 1 night)
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      setNights(calculatedNights);
      const price = hotel.price * calculatedNights;
      
      console.log(`Calculation: ${hotel.price} × ${calculatedNights} nights = ${price}`);
      setTotalPrice(price);
    } catch (err) {
      console.error("Error calculating price:", err);
      setTotalPrice(0);
      setNights(0);
    }
  };
  
  const handleCheckInChange = (e) => {
    setCheckIn(e.target.value);
  };
  
  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
  };
  
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      setError('Check-out date must be after check-in date');
      return;
    }
    
    try {
      setCheckingAvailability(true);
      setError('');
      
      const response = await axios.get(
        `${config.API_URL}/api/bookings/availability/${hotelId}`,
        { params: { checkIn, checkOut } }
      );
      
      setAvailability(response.data);
      calculateTotalPrice(); // Ensure price is calculated after availability check
      setCheckingAvailability(false);
    } catch (err) {
      setError('Failed to check availability. Please try again.');
      setCheckingAvailability(false);
    }
  };
  
  const handleBooking = async () => {
    if (!availability) {
      setError('Please check availability first');
      return;
    }
    
    if (availability.availableRooms <= 0) {
      setError('No rooms available for the selected dates');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.API_URL}/api/bookings`,
        {
          hotelId,
          checkIn,
          checkOut,
          guests
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Booking successful!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };
  
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="book-hotel-container">
          <h1>Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div>
      <Navbar />
      <div className="book-hotel-container">
        <h1>Book Your Stay</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {hotel && (
          <div className="hotel-details">
            <div className="hotel-image-container">
              <img src={hotel.image} alt={hotel.name} className="hotel-detail-image" />
            </div>
            <div className="hotel-info">
              <h2>{hotel.name}</h2>
              <p className="hotel-location">{hotel.location}</p>
              <p className="hotel-price">${hotel.price} / night</p>
              <p className="hotel-description">{hotel.description}</p>
              <p className="hotel-rooms">Total Rooms: {hotel.rooms}</p>
            </div>
          </div>
        )}
        
        <div className="booking-form">
          <h2>Select Dates</h2>
          
          <div className="form-group">
            <label>Check-in Date:</label>
            <input 
              type="date" 
              value={checkIn} 
              onChange={handleCheckInChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Check-out Date:</label>
            <input 
              type="date" 
              value={checkOut} 
              onChange={handleCheckOutChange}
              min={checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Number of Guests:</label>
            <input 
              type="number" 
              value={guests} 
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value)))}
              min="1" 
              required
            />
          </div>
          
          {checkIn && checkOut && nights > 0 && (
            <div className="price-preview">
              <p>Selected Stay: <strong>{nights} night{nights !== 1 ? 's' : ''}</strong></p>
              <p className="preview-price">Estimated Price: <strong>${totalPrice}</strong> (${hotel?.price} × {nights} nights)</p>
            </div>
          )}
          
          <button 
            className="check-availability-button" 
            onClick={checkAvailability}
            disabled={checkingAvailability || !checkIn || !checkOut}
          >
            {checkingAvailability ? 'Checking...' : 'Check Availability'}
          </button>
          
          {availability && (
            <div className="availability-info">
              <h3>Availability</h3>
              <p>
                Available Rooms: 
                <span className={availability.availableRooms > 0 ? 'available' : 'unavailable'}>
                  {availability.availableRooms}
                </span>
              </p>
              
              {availability.availableRooms > 0 && (
                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <p>
                    <strong>Hotel:</strong> {availability.hotelName}
                  </p>
                  <p>
                    <strong>Check-in:</strong> {new Date(availability.checkIn).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {new Date(availability.checkOut).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Guests:</strong> {guests}
                  </p>
                  <p>
                    <strong>Length of Stay:</strong> {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                  <p className="total-price">
                    <strong>Total Price:</strong> ${totalPrice}
                  </p>
                  
                  <button className="book-now-button" onClick={handleBooking}>
                    Book Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookHotel;
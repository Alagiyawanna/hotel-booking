import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './hotel.css';
import Navbar from './navbar';
import Footer from './footer';
import HeroSection from './hero';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = (query = '') => {
    axios.get(`http://localhost:5000/api/hotels${query}`)
      .then(response => setHotels(response.data))
      .catch(err => console.log(err));
  };

  const handleSearch = (search) => {
    fetchHotels(`?search=${search}`);
  };

  const handleFilter = (filters) => {
    const { location, name, price } = filters;
    let query = '?';

    if (location) {
      query += `location=${location}&`;
    }
    if (name) {
      query += `name=${name}&`;
    }
    if (price) {
      query += `price=${price}&`;
    }

    fetchHotels(query);
  };

  const handleBookNow = (hotelId) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You need to login to book a hotel");
      navigate('/login');
      return;
    }
    
    // If logged in, navigate to booking page
    navigate(`/book/${hotelId}`);
  };

  return (
    <div>
      <Navbar />
      <HeroSection onSearch={handleSearch} onFilter={handleFilter} />
      <div className="hotels-container">
        <h1 className="hotels-title">Hotels</h1>
        <div className="hotels-grid">
          {hotels.map(hotel => (
            <div key={hotel._id} className="hotel-card">
              <div className="hotel-image-container">
                <img src={hotel.image} alt={hotel.name} className="hotel-image" />
              </div>
              <div className="hotel-content">
                <h2 className="hotel-name">{hotel.name}</h2>
                <p className="hotel-location">{hotel.location}</p>
                <p className="hotel-price">${hotel.price} / night</p>
                <p className="hotel-rooms">
                  Rooms: <span className={hotel.availableRooms > 0 ? 'rooms-available' : 'rooms-unavailable'}>
                    {hotel.availableRooms !== undefined ? hotel.availableRooms : hotel.rooms}
                  </span>
                </p>
                <p className="hotel-description">{hotel.description}</p>
                <button className="book-button" onClick={() => handleBookNow(hotel._id)}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
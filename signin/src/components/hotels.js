import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hotel.css';
import Navbar from './navbar';
import Footer from './footer';
import HeroSection from './hero';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);

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

  return (
    <div>
      <Navbar />
      <HeroSection onSearch={handleSearch} onFilter={handleFilter} />
      <div className="hotels-container">
        <h1 className="hotels-title">Hotels</h1>
        <div className="hotels-grid">
          {hotels.map(hotel => (
            <div key={hotel._id} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} className="hotel-image" />
              <h2 className="hotel-name">{hotel.name}</h2>
              <p className="hotel-location">{hotel.location}</p>
              <p className="hotel-price">${hotel.price} / night</p>
              <p className="hotel-description">{hotel.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
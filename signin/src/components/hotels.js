import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hotel.css';
import Navbar from './navbar';
import Footer from './footer';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hotels')
      .then(response => setHotels(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar/>
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
      <Footer/>
    </div>
  );
};

export default Hotels;
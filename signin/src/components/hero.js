import React, { useState } from 'react';
import './hero.css';


const HeroSection = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSearch = () => {
    alert(`Searching for hotels with:
      Destination: ${search}
      Location: ${location}
      Name: ${name}
      Availability: ${availability}`);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Your Dream Stay</h1>
        <p>Book your perfect hotel stay with ease and comfort.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by availability..."
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
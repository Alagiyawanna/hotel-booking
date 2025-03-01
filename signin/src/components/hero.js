import React, { useState } from 'react';
import './hero.css';

const HeroSection = ({ onSearch, onFilter }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = () => {
    onSearch(search);
  };

  const handleFilter = () => {
    onFilter({ location, name, price });
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Your Dream Stay</h1>
        <p>Book your perfect hotel stay with ease and comfort.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="filter-bar">
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
            type="number"
            placeholder="Filter by price..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button onClick={handleFilter}>Filter</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
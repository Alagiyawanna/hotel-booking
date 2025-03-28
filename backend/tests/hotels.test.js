const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { describe, it, expect, beforeEach } = require('@jest/globals');

// Set up Express app for testing
const app = express();
app.use(bodyParser.json());

// Import hotel model
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Hotel routes to test
app.get('/api/hotels', async (req, res) => {
  const { search, location, name, price } = req.query;
  let query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  if (price) {
    query.price = { $lte: parseFloat(price) };
  }

  try {
    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/hotels', async (req, res) => {
  const hotel = new Hotel({
    name: req.body.name,
    location: req.body.location,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image
  });

  try {
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

describe('Hotel API', () => {
  // Sample hotel data for testing
  const sampleHotels = [
    {
      name: 'Grand Hotel',
      location: 'New York',
      price: 200,
      description: 'A luxury hotel in downtown',
      image: 'http://example.com/grand.jpg'
    },
    {
      name: 'Beach Resort',
      location: 'Miami',
      price: 300,
      description: 'Beautiful beachfront property',
      image: 'http://example.com/beach.jpg'
    },
    {
      name: 'Mountain Lodge',
      location: 'Denver',
      price: 150,
      description: 'Cozy mountain retreat',
      image: 'http://example.com/mountain.jpg'
    }
  ];

  // Seed the database before each test
  beforeEach(async () => {
    await Hotel.deleteMany({});
    await Hotel.insertMany(sampleHotels);
  });

  // Test GET /api/hotels
  describe('GET /api/hotels', () => {
    it('should return all hotels', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .expect(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].name).toBe('Grand Hotel');
    });

    it('should filter hotels by search term', async () => {
      const response = await request(app)
        .get('/api/hotels?search=Beach')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Beach Resort');
    });

    it('should filter hotels by location', async () => {
      const response = await request(app)
        .get('/api/hotels?location=Miami')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Beach Resort');
    });

    it('should filter hotels by price', async () => {
      const response = await request(app)
        .get('/api/hotels?price=200')
        .expect(200);

      expect(response.body.length).toBe(2);
      // Should include hotels with price <= 200
      expect(response.body.some(h => h.name === 'Grand Hotel')).toBeTruthy();
      expect(response.body.some(h => h.name === 'Mountain Lodge')).toBeTruthy();
    });
  });

  // Test POST /api/hotels
  describe('POST /api/hotels', () => {
    it('should create a new hotel', async () => {
      const newHotel = {
        name: 'City Center Hotel',
        location: 'Chicago',
        price: 180,
        description: 'In the heart of downtown',
        image: 'http://example.com/city.jpg'
      };

      const response = await request(app)
        .post('/api/hotels')
        .send(newHotel)
        .expect(201);

      expect(response.body.name).toBe(newHotel.name);
      expect(response.body.location).toBe(newHotel.location);

      // Verify hotel was added to database
      const hotelInDb = await Hotel.findById(response.body._id);
      expect(hotelInDb).toBeTruthy();
      expect(hotelInDb.price).toBe(180);
    });

    it('should validate required fields', async () => {
      const invalidHotel = {
        name: 'Invalid Hotel',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/hotels')
        .send(invalidHotel)
        .expect(400);

      expect(response.body.message).toBeTruthy();
    });
  });
});
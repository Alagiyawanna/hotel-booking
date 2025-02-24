const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotels');

// Get all hotels or filter hotels
router.get('/', async (req, res) => {
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

// Add a new hotel
router.post('/', async (req, res) => {
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

module.exports = router;
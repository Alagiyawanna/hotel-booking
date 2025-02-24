const express = require('express');
const router = express.Router();
// const Hotel = require('../models/Hotel');
const Hotel = require('../models/hotels');

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
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
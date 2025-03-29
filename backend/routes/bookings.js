const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Hotel = require('../models/hotels');
const { auth } = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.body;
    
    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }
    
    // Check if hotel exists and has rooms available
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Count existing bookings for the date range
    const existingBookings = await Booking.countDocuments({
      hotel: hotelId,
      status: 'confirmed',
      $or: [
        // Check if the existing booking overlaps with the new booking
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });
    
    // Check if rooms are available
    if (existingBookings >= hotel.rooms) {
      return res.status(400).json({ message: 'No rooms available for the selected dates' });
    }
    
    // Create new booking
    const booking = new Booking({
      hotel: hotelId,
      user: req.userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      status: 'confirmed'
    });
    
    const newBooking = await booking.save();
    
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('hotel', 'name location image price')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id,
      user: req.userId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check room availability
router.get('/availability/:hotelId', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Find the hotel
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Count existing bookings for the date range
    const existingBookings = await Booking.countDocuments({
      hotel: req.params.hotelId,
      status: 'confirmed',
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });
    
    const availableRooms = Math.max(0, hotel.rooms - existingBookings);
    
    res.json({
      hotelId: hotel._id,
      hotelName: hotel.name,
      totalRooms: hotel.rooms,
      availableRooms,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
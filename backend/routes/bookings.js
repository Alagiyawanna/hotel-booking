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

// Extend booking stay
router.patch('/:id/extend', auth, async (req, res) => {
  try {
    const { newCheckOut } = req.body;
    
    if (!newCheckOut) {
      return res.status(400).json({ message: 'New check-out date is required' });
    }
    
    // Find the booking
    const booking = await Booking.findOne({ 
      _id: req.params.id,
      user: req.userId,
      status: 'confirmed'
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Active booking not found' });
    }
    
    const newCheckOutDate = new Date(newCheckOut);
    const currentCheckOut = new Date(booking.checkOut);
    
    // Validate new date is after current checkout
    if (newCheckOutDate <= currentCheckOut) {
      return res.status(400).json({ message: 'New check-out date must be after current check-out date' });
    }
    
    // Check if extension is possible (room availability)
    const hotel = await Hotel.findById(booking.hotel);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Count overlapping bookings during the extension period
    const overlappingBookings = await Booking.countDocuments({
      hotel: booking.hotel,
      status: 'confirmed',
      _id: { $ne: booking._id }, // Exclude current booking
      $or: [
        {
          checkIn: { $lte: newCheckOutDate },
          checkOut: { $gte: currentCheckOut }
        }
      ]
    });
    
    // Check if rooms are available for extension
    if (overlappingBookings >= hotel.rooms) {
      return res.status(400).json({ message: 'No rooms available for the requested extension period' });
    }
    
    // If available, update the booking
    booking.checkOut = newCheckOutDate;
    await booking.save();
    
    res.json({ 
      message: 'Stay extended successfully',
      newCheckOut: newCheckOutDate
    });
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
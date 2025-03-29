const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel',
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
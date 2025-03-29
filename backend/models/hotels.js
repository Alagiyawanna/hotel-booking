const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  rooms: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
const mongoose = require('mongoose');
require('dotenv').config();

// Import the Hotel model
const Hotel = require('../models/hotels');

const seedHotels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Define the hotels to add
    const hotels = [
      {
        name: 'Hotel Paradise',
        location: 'Maldives',
        price: 350,
        description: 'A luxurious beachfront resort with stunning ocean views. Perfect for a tropical getaway.',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
        rooms: 10
      },
      {
        name: 'Hotel Sunshine',
        location: 'Bangkok, Thailand',
        price: 180,
        description: 'Modern urban hotel in the heart of Bangkok with easy access to shopping and nightlife.',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
        rooms: 6
      }
    ];
    
    // Check if hotels already exist
    for (const hotel of hotels) {
      const existingHotel = await Hotel.findOne({ name: hotel.name });
      
      if (existingHotel) {
        // Update existing hotel
        await Hotel.updateOne({ _id: existingHotel._id }, { 
          $set: { 
            location: hotel.location,
            price: hotel.price,
            description: hotel.description,
            image: hotel.image,
            rooms: hotel.rooms
          } 
        });
        console.log(`Updated hotel: ${hotel.name}`);
      } else {
        // Create new hotel
        await Hotel.create(hotel);
        console.log(`Added new hotel: ${hotel.name}`);
      }
    }
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedHotels();
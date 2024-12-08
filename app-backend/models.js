const mongoose = require('mongoose');

// Define schema for bookings
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  seats: [
    {
      row: { type: Number, required: true },
      seat: { type: Number, required: true }
    }
  ]
});

// Create model for the 'bookings' collection
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

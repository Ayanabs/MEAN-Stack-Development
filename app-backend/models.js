const mongoose = require('mongoose');

// Define schema for bookings
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  movieName: { type: String, required: true }, // Name of the movie
  showTime: { type: String, required: true }, // Show time (e.g., 10:00 AM)
  seats: [
    {
      row: { type: Number, required: true }, // Row number of the seat
      seat: { type: Number, required: true }, // Seat number in the row
      booked: { type: Boolean, default: false }, // Booking status
    },
  ],
});

// Create model for the 'bookings' collection
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

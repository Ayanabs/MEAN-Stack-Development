const mongoose = require('mongoose');

// Booking schema
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  movieName: { type: String, required: true },
  showTimes: { type: String, required: true },
  seats: [
    {
      row: { type: Number, required: true },
      seat: { type: Number, required: true },
    },
  ],
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

const mongoose = require('mongoose');

// Movie Schema without description
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true }, // Path to the uploaded image
  showTimes: {
    type: [String], // Array of strings for showtimes
    required: true,
    default: [] // Default to an empty array
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = { Movie };
// Booking schema
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  showTime: { type: String, required: true },
  seats: [
    {
      row: { type: Number, required: true },
      seat: { type: Number, required: true },
    },
  ],
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Movie, Booking };

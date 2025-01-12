const express = require('express');
const router = express.Router();
const Booking = require('./models');

// Get all movies
router.get('/api/movies', async (req, res) => {
  try {
    const movies = [
      {
        name: 'Movie A',
        image: 'https://via.placeholder.com/150',
        times: ['10:00 AM', '1:00 PM', '4:00 PM'],
      },
      {
        name: 'Movie B',
        image: 'https://via.placeholder.com/150',
        times: ['11:00 AM', '2:00 PM', '5:00 PM'],
      },
    ];
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

// Get bookings for a specific date, movie, and time
router.get('/api/bookings/:date/:movie/:time', async (req, res) => {
  const { date, movie, time } = req.params;
  try {
    const booking = await Booking.findOne({ date, movieName: movie, showTime: time });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'No bookings found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Save or update bookings
router.post('/api/bookings', async (req, res) => {
  const { date, movieName, showTime, seats } = req.body;
  try {
    let booking = await Booking.findOne({ date, movieName, showTime });
    if (booking) {
      booking.seats = seats;
    } else {
      booking = new Booking({ date, movieName, showTime, seats });
    }
    await booking.save();
    res.status(200).json({ message: 'Booking saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking', error: error.message });
  }
});

// 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

module.exports = router;

const express = require('express');
const Booking = require('./models'); // Adjust the path to your Booking model
const router = express.Router();

router.post('/api/bookings', async (req, res) => {
  const { date, seats } = req.body;
  try {
    let booking = await Booking.findOne({ date });
    if (booking) {
      // Update seats for the date
      booking.seats = seats;
    } else {
      // Create a new booking entry
      booking = new Booking({ date, seats });
    }
    await booking.save();
    res.status(200).json({ message: 'Booking saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving booking', error: err.message });
  }
});

module.exports = router;

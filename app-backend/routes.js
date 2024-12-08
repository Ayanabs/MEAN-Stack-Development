router.post('/bookings', async (req, res) => {
  const { date, movieName, showTime, seats } = req.body;

  try {
    // Check if a booking already exists for the given date, movie, and showtime
    let booking = await Booking.findOne({ date, movieName, showTime });

    if (booking) {
      // Update the existing booking
      booking.seats = seats;
    } else {
      // Create a new booking
      booking = new Booking({ date, movieName, showTime, seats });
    }

    // Save the booking
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully!' });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
});

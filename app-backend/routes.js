const express = require('express');
const multer = require('multer');
const path = require('path');
const { Movie, Booking } = require('./models');  // Assuming you use models for both

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Add a new movie with an image and showtimes
router.post('/api/movies', upload.single('image'), async (req, res) => {
  const { title, description, showTimes } = req.body;
  const imagePath = req.file ? req.file.path : ''; // Get image path from upload

  if (!imagePath) {
    return res.status(400).json({ message: 'Image is required' });
  }
  
  // Convert showTimes into an array (assuming it's a comma-separated string)
  const showTimesArray = showTimes ? showTimes.split(',') : [];

  try {
    const movie = new Movie({ title, description, showTimes: showTimesArray, imagePath });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error saving movie', error: error.message });
  }
});

// Get all movies from the database
router.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

// Get a specific movie with showtimes and image
router.get('/api/movies/:movieId', async (req, res) => {
  const { movieId } = req.params;
  
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
});


// Get bookings for a specific date, movie, and time
router.get('/api/bookings/:date/:movie/:time', async (req, res) => {
  const { date, movie, time } = req.params;
  try {
    // Find movie by title
    const movieDoc = await Movie.findOne({ title: movie });
    if (!movieDoc) {
      return res.status(400).json({ message: 'Movie not found' });
    }

    // Find booking for this movie, date, and time
    const booking = await Booking.findOne({ 
      date, 
      movie: movieDoc._id, 
      showTime: time 
    }).populate('movie', 'title imagePath'); // Populate movie data

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
  const { date, movie, showTime, seats } = req.body;
  
  try {
    // Find the movie by title to get its ObjectId
    const movieDoc = await Movie.findOne({ title: movie });

    if (!movieDoc) {
      return res.status(400).json({ message: 'Movie not found' });
    }

    // Create or update the booking with the movie's ObjectId
    let booking = await Booking.findOne({ date, movie: movieDoc._id, showTime });
    if (booking) {
      booking.seats = seats; // Update seats if booking exists
    } else {
      booking = new Booking({ date, movie: movieDoc._id, showTime, seats }); // Create new booking with ObjectId
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

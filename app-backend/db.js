const mongoose = require('mongoose');
require('dotenv').config(); // To use .env variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      
    });
    console.log('Connected to BookingData database!');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

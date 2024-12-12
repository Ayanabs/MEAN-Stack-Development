const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); // MongoDB connection setup
const routes = require('./routes'); // API routes
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('uploads')); // Serve static files (images) from the 'uploads' folder
// Serve images from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Use routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

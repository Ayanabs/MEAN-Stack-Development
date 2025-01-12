const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); // MongoDB connection setup
const routes = require('./routes'); // API routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import connectDB from './database'; // MongoDB connection
import userSignUpRoutes from './user/user_signup_backend/user_signup_backend.routes'; // Routes for user signup
import userLoginRoutes from './user/userloginbackend/userloginbackend.routes';
import MongoStore from 'connect-mongo';
import session from 'express-session';

dotenv.config(); // Load environment variables from .env

const app: Application = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

// Allow requests from localhost:4200 (frontend)
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow only your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Configure Sessions
app.use(
  session({
    secret: 'ahk', // Replace with a secure random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/sample', // MongoDB connection string
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Use the signup route
app.use('/api/users', userSignUpRoutes);

// Use the login route
app.use('/api/users', userLoginRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Backend server for signup functionality');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

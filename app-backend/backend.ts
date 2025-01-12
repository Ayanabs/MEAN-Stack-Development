import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import connectDB from './database'; // MongoDB connection
import userSignUpRoutes from './user/user_signup_backend/user_signup_backend.routes'; // Routes for user signup
import userLoginRoutes from './user/userloginbackend/userloginbackend.routes';
import insertMovieRoutes from './admin/admin_movie/admin_insert_movie.routes';
import retrieveMovieRoutes from './movies/retrieve_movie.routes';
import retrieveMovieByNameRoutes from './movies/retrieve_movie_byName';
import adminSignUpRoutes from './admin/admin_user/admin_user_signup';
import AdminSignInRoutes from './admin/admin_user/admin_user_signin';
import deleteMovieRoutes from './admin/admin_movie/admin_delete_movie.routes';
import updateMovieRoutes from './admin/admin_movie/admin_update_movie.routes';
import retrieveMovieById from './admin/admin_movie/admin_retrieve_movieById';
import userlogout from './user/userlogoutbackend/user_logout.routes';
import insertBooking from './seating/up_save_bookings_routes';
import retrieveBooking from './seating/get_bookings_routes';
import removeBooking from './seating/remove_booking_routes';

import MongoStore from 'connect-mongo';
import session from 'express-session';
import path from 'path';
import { Request, Response, NextFunction } from 'express';


dotenv.config(); // Load environment variables from .env

const app: Application = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors")

// Allow requests from localhost:4200 (frontend)
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow only your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Configure Sessions
app.use(session({
  secret: 'your-secret-key',  // Use a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },  // Set 'true' if using HTTPS
}));



export const isAuthenticated = (req: Request, Request: { new(input: RequestInfo | URL, init?: RequestInit): globalThis.Request; prototype: globalThis.Request; }, res: Response, Response: { new(body?: BodyInit | null, init?: ResponseInit): globalThis.Response; prototype: globalThis.Response; error(): globalThis.Response; json(data: any, init?: ResponseInit): globalThis.Response; redirect(url: string | URL, status?: number): globalThis.Response; }, next: NextFunction) => {
  if (req.session && req.session.id) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Log every request to /api/users routes
app.use('/api/users', (req: Request, res: Response, next: NextFunction) => {
  console.log(`Accessed route: ${req.originalUrl}`);
  next();  // Pass control to the next handler
});

// Use the insert booking route
app.use('/api/users/booking',removeBooking  );


// Use the get seating route
app.use('/api/users',retrieveBooking );

// Use the signup route
app.use('/api/users', userSignUpRoutes);

// Use the login route
app.use('/api/users', userLoginRoutes);

// Use the logout route
app.use('/api/users', userlogout);

// Use the insert movie route
app.use('/api/users', insertMovieRoutes);

// Use the retrieve movie route
app.use('/api/users', retrieveMovieRoutes);

// Use the retrieve movie by name route
app.use('/api/users', retrieveMovieByNameRoutes);

// Use the admin signup route
app.use('/api/admin', adminSignUpRoutes);

// Use the admin signin route
app.use('/api/admin', AdminSignInRoutes);

// Use the delete movie route
app.use('/api/users', deleteMovieRoutes);

// Use the update movie route
app.use('/api/users', updateMovieRoutes);

// Use the retrieve movieById route
app.use('/api/users', retrieveMovieById);

// Use the insert booking route
app.use('/api/users',insertBooking  );





// Default route
app.get('/', (req, res) => {
  res.send('Backend server for signup functionality');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

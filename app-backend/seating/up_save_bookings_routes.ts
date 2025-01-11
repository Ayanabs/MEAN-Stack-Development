import express, { Request, Response, Router } from 'express';
import Booking from './models';

const router: Router = express.Router();

// Define the type for the Booking request body
interface BookingRequest {
  userid:string,
  username:string,
  date: string;
  movieName: string;
  showTimes: string;
  seats: [];
}

// Save or update bookings
router.post('/bookings_collection', async (req: Request, res: Response) => {
  const { userid, username, date, movieName, showTimes, seats }: BookingRequest = req.body;
  console.log("Backend Booking data", req.body);

  try {
    let booking = await Booking.findOne({ userid, username, date, movieName, showTimes });

    if (booking) {
      // Merge new seats with existing ones, ensuring no duplicates
      const existingSeats = new Set(booking.seats.map(seat => JSON.stringify(seat))); // Serialize seats to compare objects
      const newSeats = seats.filter(seat => !existingSeats.has(JSON.stringify(seat))); // Filter out duplicates
      booking.seats = [...booking.seats, ...newSeats]; // Append new seats
    } else {
      // Create a new booking
      booking = new Booking({ userid, username, date, movieName, showTimes, seats });
    }

    await booking.save();
    res.status(200).json({ message: 'Booking saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking', error: (error as Error).message });
  }
});

export default router;

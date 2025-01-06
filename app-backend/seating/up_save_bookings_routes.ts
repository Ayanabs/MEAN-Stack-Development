import express, { Request, Response, Router } from 'express';
import Booking from './models';

const router: Router = express.Router();

// Define the type for the Booking request body
interface BookingRequest {
  userid:string,
  username:string,
  date: string;
  movieName: string;
  showTime: string;
  seats: [];
}

// Save or update bookings
router.post('/bookings_collection', async (req: Request, res: Response) => {
  const {  userid, username,date, movieName, showTime, seats }: BookingRequest = req.body;
  console.log("Backend Booking data",req.body)
  try {
    let booking = await Booking.findOne({ userid, username,date, movieName, showTime });
    if (booking) {
      booking.seats = seats;
    } else {
      booking = new Booking({ userid, username,date, movieName, showTime, seats });
    }
    await booking.save();
    res.status(200).json({ message: 'Booking saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking', error: (error as Error).message });
  }
});

// 404 handler for undefined routes
router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

export default router;

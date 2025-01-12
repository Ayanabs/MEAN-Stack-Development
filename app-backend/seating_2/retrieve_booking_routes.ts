import express, { Request, Response, Router } from 'express';
import Booking from '../seating/models';

const router = express.Router();



router.post('/retrievebooking', async (req: Request, res: Response): Promise<void> => {
    const { date, name, time } = req.body;
  console.log("Get booking info before try block:", date, name, time);
  
  try {
    const moviename = decodeURIComponent(name as string);
    const showtimes = decodeURIComponent(time as string);

    console.log("Get booking info:", date, moviename, showtimes);

    const bookings = await Booking.find({
      date: date,
      movieName: moviename,
      showTimes: showtimes,
    });

    if (!bookings || bookings.length === 0) {
      console.log('No bookings found for the specified criteria.');
      res.status(200).json([]);
      return;
    }

    const bookedSeats = bookings.flatMap((booking) => booking.seats);
    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

export default router;

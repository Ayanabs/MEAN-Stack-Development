import express, { Request, Response, Router } from 'express';
import Booking from './models';

const router: Router = express.Router();




// Get bookings for a specific date, movie, and time
router.get('/bookings_collection/:date/:movie/:time', async (req: Request, res: Response) => {
  const { date, movie, time } = req.params;
  console.log("get booking file accessed:",req.params);
  try {
    const booking = await Booking.findOne({ date, movieName: movie, showTime: time });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'No bookings found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: (error as Error).message });
  }
});




export default router;
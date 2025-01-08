import express, { Request, Response } from 'express';
import Booking from './models'; // Import your Booking model

const router = express.Router();

// Remove a specific seat from the booking
router.put('/remove_seat/:bookingId', async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { seat } = req.body;

    if (!seat) {
        res.status(400).json({ message: 'Seat to remove is required.' });
        return;
    }

    try {
        // Find the booking document
        const booking = await Booking.findById({_id:bookingId});

        if (!booking) {
            res.status(404).json({ message: 'Booking not found.' });
            return;
        }

        console.log('Booking fetched from database:', booking);

        // Parse the seat string into row and seat numbers
        const [rowToRemove, seatToRemove] = seat.split('-').map(Number);
        if (isNaN(rowToRemove) || isNaN(seatToRemove)) {
            res.status(400).json({ message: 'Invalid seat format.' });
            return;
        }

        console.log(`Parsed seat to remove: Row=${rowToRemove}, Seat=${seatToRemove}`);

        // Remove the specified seat from the seats array
        const updatedSeats = booking.seats.filter(
            (s: { row: number; seat: number }) => !(s.row === rowToRemove && s.seat === seatToRemove)
        );

        console.log('Updated seats after removal attempt:', updatedSeats);

        // If no seat was removed
        if (updatedSeats.length === booking.seats.length) {
            res.status(404).json({ message: 'Seat not found in booking.' });
            return;
        }

        // Update the booking with the new seats array
        booking.seats = updatedSeats;

        // If no seats remain, delete the entire booking
        if (updatedSeats.length === 0) {
            await booking.deleteOne();
            res.status(200).json({ message: 'Booking removed as no seats remain.' });
        } else {
            await booking.save();
            res.status(200).json({ message: 'Seat removed successfully.', updatedBooking: booking });
        }
    } catch (error) {
        console.error('Error during seat removal:', error);
        res.status(500).json({ message: 'Error removing seat.', error: (error as Error).message });
    }
});





export default router;

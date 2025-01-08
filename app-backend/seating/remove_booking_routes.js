"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models")); // Import your Booking model
const router = express_1.default.Router();
// Remove a specific seat from the booking
router.put('/remove_seat/:bookingId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const { seat } = req.body;
    if (!seat) {
        res.status(400).json({ message: 'Seat to remove is required.' });
        return;
    }
    try {
        // Find the booking document
        const booking = yield models_1.default.findById({ _id: bookingId });
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
        const updatedSeats = booking.seats.filter((s) => !(s.row === rowToRemove && s.seat === seatToRemove));
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
            yield booking.deleteOne();
            res.status(200).json({ message: 'Booking removed as no seats remain.' });
        }
        else {
            yield booking.save();
            res.status(200).json({ message: 'Seat removed successfully.', updatedBooking: booking });
        }
    }
    catch (error) {
        console.error('Error during seat removal:', error);
        res.status(500).json({ message: 'Error removing seat.', error: error.message });
    }
}));
exports.default = router;

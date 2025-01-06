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
const models_1 = __importDefault(require("../seating/models"));
const router = express_1.default.Router();
router.post('/retrievebooking', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, name, time } = req.body;
    console.log("Get booking info before try block:", date, name, time);
    try {
        const moviename = decodeURIComponent(name);
        const showtime = decodeURIComponent(time);
        console.log("Get booking info:", date, moviename, showtime);
        const bookings = yield models_1.default.find({
            date: date,
            movieName: moviename,
            showTime: showtime,
        });
        if (!bookings || bookings.length === 0) {
            console.log('No bookings found for the specified criteria.');
            res.status(200).json([]);
            return;
        }
        const bookedSeats = bookings.flatMap((booking) => booking.seats);
        res.status(200).json(bookedSeats);
    }
    catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
}));
exports.default = router;

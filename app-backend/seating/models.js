"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Booking schema
const bookingSchema = new mongoose_1.default.Schema({
    userid: { type: String, required: true },
    username: { type: String, required: true },
    date: { type: String, required: true },
    movieName: { type: String, required: true },
    showTimes: { type: String, required: true },
    seats: [
        {
            row: { type: Number, required: true },
            seat: { type: Number, required: true },
        },
    ],
});
// Booking model
const Booking = mongoose_1.default.model('Booking', bookingSchema, 'bookings_collection');
exports.default = Booking;

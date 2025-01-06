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
const models_1 = __importDefault(require("./models"));
const router = express_1.default.Router();
// Get bookings for a specific date, movie, and time
router.get('/bookings_collection/:date/:movie/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, movie, time } = req.params;
    console.log("get booking file accessed:", req.params);
    try {
        const booking = yield models_1.default.findOne({ date, movieName: movie, showTime: time });
        if (booking) {
            res.status(200).json(booking);
        }
        else {
            res.status(404).json({ message: 'No bookings found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
}));
exports.default = router;

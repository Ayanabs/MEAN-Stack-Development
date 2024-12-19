"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define Mongoose Schema
const movieSchema = new mongoose_1.default.Schema({
    movieName: { type: String, required: true },
    category: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    picture: { type: String, required: true }, // Store the file path or base64 encoded image
    additionalInfo: { type: String },
});
// Create Mongoose Model
exports.Movie = mongoose_1.default.model('Movie', movieSchema, 'movie_collection');

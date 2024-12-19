import mongoose from "mongoose";

// Define Mongoose Schema
const movieSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    category: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    picture: { type: String, required: true }, // Store the file path or base64 encoded image
    additionalInfo: { type: String },
  });
  
  // Create Mongoose Model
 export const Movie = mongoose.model('Movie', movieSchema, 'movie_collection');
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
const movie_model_1 = require("./movie_model");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get('/getmovies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Fetching movies...');
    try {
        // Retrieve all movies from the database
        const movies = yield movie_model_1.Movie.find();
        // Check if there are movies in the database
        if (movies.length === 0) {
            res.status(404).json({ message: 'No movies found in the database' });
            return;
        }
        // Determine the default image URL from the first movie
        const defaultImage = `http://localhost:5000/uploads/${path_1.default.basename(movies[0].picture)}`;
        // Map through the movies to include the full URL for the picture
        const retrievedMovies = movies.map(movie => (Object.assign(Object.assign({}, movie.toObject()), { picture: movie.picture
                ? `http://localhost:5000/uploads/${path_1.default.basename(movie.picture)}`
                : defaultImage })));
        console.log('Movies retrieved:', retrievedMovies);
        // Send the retrieved movies as JSON response
        res.status(200).json(retrievedMovies);
    }
    catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ message: 'Error fetching movies from database' });
    }
}));
exports.default = router;

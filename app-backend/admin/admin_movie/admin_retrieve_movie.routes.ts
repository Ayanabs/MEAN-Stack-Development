import express, { Request, Response } from 'express';
import { Movie } from './movie_model';
import path from 'path';

const router = express.Router();

router.get('/getmovies', async (req: Request, res: Response): Promise<void> => {
  console.log('Fetching movies...');
  try {
    // Retrieve all movies from the database
    const movies = await Movie.find();

    // Check if there are movies in the database
    if (movies.length === 0) {
      res.status(404).json({ message: 'No movies found in the database' });
      return;
    }

    // Determine the default image URL from the first movie
    const defaultImage = `http://localhost:5000/uploads/${path.basename(movies[0].picture)}`;

    // Map through the movies to include the full URL for the picture
    const retrievedMovies = movies.map(movie => ({
      ...movie.toObject(), // Convert movie document to a plain object
      picture: movie.picture
        ? `http://localhost:5000/uploads/${path.basename(movie.picture)}`
        : defaultImage, // Use the default image if no picture is set
    }));

    console.log('Movies retrieved:', retrievedMovies);

    // Send the retrieved movies as JSON response
    res.status(200).json(retrievedMovies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Error fetching movies from database' });
  }
});

export default router;

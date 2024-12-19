import express, { Request, Response } from 'express';
import { Movie } from './movie_model'; // Movie model

const router = express.Router();
const multer = require('multer');

import path from 'path';

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/'); // Uploads folder
  },
  filename: (req: any, file: { originalname: string; fieldname: any; }, cb: (arg0: null, arg1: string) => void) => {
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${Date.now()}-${file.fieldname}${ext}`); // Create a unique filename
  },
});

// Define file filter to accept only images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });


// Route to update a movie by ID
router.put('/updatemovie/:id', upload.single('picture'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { movieName, category, releaseYear, additionalInfo } = req.body;
  let updateData: any = { movieName, category, releaseYear, additionalInfo };

  try {
    // If a picture is uploaded, add its path to the update data
    if (req.file) {
       updateData.picture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // Full image URL
    }

    // Find the movie by ID and update it
    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMovie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    res.status(200).json({ message: 'Movie updated successfully', updatedMovie });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ message: 'Error updating movie', error: err });
  }
});

export default router;

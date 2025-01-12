import express, { Request, Response } from 'express';
import userModel from '../userModel';
import session from 'express-session';



const router = express.Router();

// User Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {

  const { username, password } = req.body;

  // console.log('Received login request:', { username, password });

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Find user by username
    const user = await userModel.findOne({ username }) as unknown as { _id: string; username: string; password: string } | null;

    if (!user) {
      res.status(401).json({ message: 'User does not exist' });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }
      // Store session data
      req.session.userId = user._id; // Store the user's ID in the session
      req.session.username = user.username; // Store the user's username in the session
  
      res.status(200).json({ 
        message: 'Login successful',
        
        sessionId: req.sessionID, 
         userId: user._id, 
         username: user.username 
      });
      console.log("session id in loginbackend:",req.sessionID)


    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

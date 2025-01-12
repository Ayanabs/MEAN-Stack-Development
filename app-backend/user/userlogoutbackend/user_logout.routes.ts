import express, { Request, Response } from 'express';
import session from 'express-session'; // Ensure this is imported

const router = express.Router();

// User Logout Route
router.post('/logout', (req: Request, res: Response): void => {
    const sessionId = req.body.sessionId
    console.log('Session ID before logout:', sessionId);
    

    req.session.destroy((err: any) => {
        if (err) {
            res.status(500).json({ message: 'Error logging out' });
        } else {
            res.status(200).json({ message: 'Logout successful' });
            console.log('Session destroyed:', sessionId);
        }
    });
});

export default router;

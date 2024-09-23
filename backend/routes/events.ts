import express, { Request, Response } from 'express';
import Event from '../controllers/events';
import upload from '../middleware/multer';
import authMiddleware from '../middleware/auth';
const router = express.Router();

// Route to create a new events
router.post('/events/add', [authMiddleware, upload.single('event_image')], (req: Request, res: Response) => Event.add(req, res));

// Route to get all eventss
router.get('/events/getAll', (req: Request, res: Response) => Event.getAll(req, res));

// Route to get a specific events by ID
router.get('/events/:id', (req: Request, res: Response) => Event.getEventById(req, res));

// Route to update a events by ID
router.put('/events/:id', [authMiddleware, upload.single('event_image')], (req: Request, res: Response) => Event.update(req, res));

// Route to delete a events by ID
router.delete('/events/:id', authMiddleware, (req: Request, res: Response) => Event.deleteEventById(req, res));

export default router;
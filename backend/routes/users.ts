import express, { Request, Response, Router } from 'express';
import User from '../controllers/users';

const router: Router = express.Router();

// Route to create a new user
router.post('/users/create', (req: Request, res: Response) => User.createUser(req, res));

// Route to get all users
router.get('/users/getAll', (req: Request, res: Response) => User.getAll(req, res));

// Route to get a specific user by ID
router.get('/users/:id', (req: Request, res: Response) => User.getUserById(req, res));

// Route to update a user by ID
router.put('/users/:id', (req: Request, res: Response) => User.update(req, res));

// Route to delete a user by ID
router.delete('/users/:id', (req: Request, res: Response) => User.deleteUserById(req, res));

export default router;
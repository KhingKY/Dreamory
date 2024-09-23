import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import path from 'path';
import authRoutes from './routes/auth';

dotenv.config();

const app: express.Application = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);  // Base URL for the user routes
app.use('/api', eventRoutes);  // Base URL for the event routes
app.use('/api/auth', authRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI as string)
	.then(() => console.log('MongoDB connected'))
	.catch((err: Error) => console.log(err));

const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, (): void => {
	console.log(`Server running on port ${PORT}`);
});
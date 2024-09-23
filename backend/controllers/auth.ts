
import { Request, Response } from 'express';
import User from '../models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response): Promise<void | Response> => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ user_name: username, user_password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
};

const login = async (req: Request, res: Response): Promise<void | Response> => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ user_name: username });
        if (!user || !(await bcrypt.compare(password, user.user_password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export default{
    register,
    login
}
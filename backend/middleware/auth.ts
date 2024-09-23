import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: any; // Attach the user to the request object after decoding the token
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    console.log(token);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // Attach the decoded user information to the request object
        console.log("decoded");
        console.log(decoded);
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;
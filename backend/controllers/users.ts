import { Request, Response } from 'express';
import User from '../models/users';

const createUser = async (req: Request, res: Response): Promise<void> => {
    const { user_name, user_password }: { user_name: string; user_password: string } = req.body;

    try {
        const newUser = new User({
            user_name,
            user_password,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
        });
    }
};


const getAll = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

const getUserById = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message,
        });
    }
};

const update = async (req: Request, res: Response): Promise<void | Response> => {
    const { user_name, user_password }: { user_name?: string; user_password?: string } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { user_name, user_password },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
};

const deleteUserById = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const deletedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { record_status: "DELETED" } },
            { new: true }
        );

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

export default {
    createUser,
    getAll,
    getUserById,
    update,
    deleteUserById
}
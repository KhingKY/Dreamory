"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, user_password } = req.body;
    try {
        const newUser = new users_1.default({
            user_name,
            user_password,
        });
        yield newUser.save();
        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
        });
    }
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message,
        });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message,
        });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, user_password } = req.body;
    try {
        const updatedUser = yield users_1.default.findByIdAndUpdate(req.params.id, { user_name, user_password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
});
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield users_1.default.findByIdAndUpdate(req.params.id, { $set: { record_status: "DELETED" } }, { new: true });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message,
        });
    }
});
exports.default = {
    createUser,
    getAll,
    getUserById,
    update,
    deleteUserById
};

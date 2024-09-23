"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const router = express_1.default.Router();
// Route to create a new user
router.post('/users/create', (req, res) => users_1.default.createUser(req, res));
// Route to get all users
router.get('/users/getAll', (req, res) => users_1.default.getAll(req, res));
// Route to get a specific user by ID
router.get('/users/:id', (req, res) => users_1.default.getUserById(req, res));
// Route to update a user by ID
router.put('/users/:id', (req, res) => users_1.default.update(req, res));
// Route to delete a user by ID
router.delete('/users/:id', (req, res) => users_1.default.deleteUserById(req, res));
exports.default = router;

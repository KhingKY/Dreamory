"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_1 = __importDefault(require("../controllers/events"));
const multer_1 = __importDefault(require("../middleware/multer"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Route to create a new events
router.post('/events/add', [auth_1.default, multer_1.default.single('event_image')], (req, res) => events_1.default.add(req, res));
// Route to get all eventss
router.get('/events/getAll', auth_1.default, (req, res) => events_1.default.getAll(req, res));
// Route to get a specific events by ID
router.get('/events/:id', (req, res) => events_1.default.getEventById(req, res));
// Route to update a events by ID
router.put('/events/:id', [auth_1.default, multer_1.default.single('event_image')], (req, res) => events_1.default.update(req, res));
// Route to delete a events by ID
router.delete('/events/:id', auth_1.default, (req, res) => events_1.default.deleteEventById(req, res));
exports.default = router;

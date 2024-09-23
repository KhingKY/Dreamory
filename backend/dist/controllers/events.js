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
const events_1 = __importDefault(require("../models/events"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_name, event_start_date, event_end_date, event_location, event_status } = req.body;
    const event_img_location = req.file ? req.file.path : null;
    try {
        const newEvent = new events_1.default({
            event_name,
            event_start_date,
            event_end_date,
            event_location,
            event_status,
            event_img_location
        });
        yield newEvent.save();
        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating event',
            error: error.message
        });
    }
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield events_1.default.find({ "record_status": "SHOW" });
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching events',
            error: error.message,
        });
    }
});
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield events_1.default.findOne({
            _id: req.params.id,
            "record_status": "SHOW"
        });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching event',
            error: error.message,
        });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_name, event_start_date, event_end_date, event_location, event_status } = req.body;
    const event_img_location = req.file ? req.file.path : null;
    try {
        const updateFields = {
            event_name,
            event_start_date,
            event_end_date,
            event_location,
            event_status
        };
        if (event_img_location) {
            updateFields.event_img_location = event_img_location;
        }
        const updatedEvent = yield events_1.default.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true, runValidators: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating event',
            error: error.message,
        });
    }
});
const deleteEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEvent = yield events_1.default.findByIdAndUpdate(req.params.id, { $set: { record_status: "DELETED" } }, { new: true });
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({
            message: 'Event deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting event',
            error: error.message,
        });
    }
});
exports.default = {
    add,
    getAll,
    getEventById,
    update,
    deleteEventById
};

import { Request, Response } from 'express';
import Event from '../models/events';


interface EventRequestBody {
    event_name: string;
    event_start_date: Date;
    event_end_date: Date;
    event_location: string;
    event_status: string;
    event_img_location: string;
}

interface RequestParam {
    id: string;
}



const add = async (req: Request<{}, {}, EventRequestBody>, res: Response): Promise<void> => {

    const { event_name, event_start_date, event_end_date, event_location, event_status } = req.body;
    const event_img_location = req.file ? req.file.path : null;
    try {
        const newEvent = new Event({
            event_name,
            event_start_date,
            event_end_date,
            event_location,
            event_status,
            event_img_location
        });
        
        await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error creating event',
            error: error.message
        });
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find({"record_status": "SHOW"});
        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching events',
            error: error.message,
        });
    }
};

const getEventById = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const event = await Event.findOne({
            _id :req.params.id,
            "record_status": "SHOW"
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching event',
            error: error.message,
        });
    }
};

const update = async (req: Request, res: Response): Promise<void | Response> => {
    const { event_name, event_start_date, event_end_date, event_location, event_status } = req.body;
    const event_img_location = req.file ? req.file.path : null;
    try {
        const updateFields: any = {
            event_name,
            event_start_date,
            event_end_date,
            event_location,
            event_status
        };
        if (event_img_location) {
            updateFields.event_img_location = event_img_location;
        }
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error updating event',
            error: error.message,
        });
    }
};

const deleteEventById = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const deletedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: { record_status: "DELETED" } },
            { new: true }
        );

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error deleting event',
            error: error.message,
        });
    }
};

export default {
    add,
    getAll,
    getEventById,
    update,
    deleteEventById
}
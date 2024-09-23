import mongoose, { Document, Schema } from 'mongoose';

interface IEvent extends Document {
  event_name: string;
  event_start_date?: Date;
  event_end_date?: Date;
  event_location?: string;
  event_status?: string;
  event_img_location?: string;
  record_status?: string;
}

const eventsSchema: Schema<IEvent> = new Schema({
  event_name: { type: String, required: true },
  event_start_date: { type: Date },
  event_end_date: { type: Date },
  event_location: String,
  event_status: { type: String, default: "ONGOING" },
  event_img_location: String,
  record_status: { type: String, default: "SHOW" },
}, { timestamps: true });

export default mongoose.model<IEvent>('events', eventsSchema);
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  user_name: string;
  user_password: string;
  user_is_admin: boolean;
  record_status: string;
}

const userSchema: Schema<IUser> = new Schema({
  user_name: { type: String, required: true , unique: true },
  user_password: { type: String, required: true },
  user_is_admin: { type: Boolean, default: false },
  record_status: { type: String, default: "SHOW" }
}, { timestamps: true });

export default mongoose.model<IUser>('users', userSchema);
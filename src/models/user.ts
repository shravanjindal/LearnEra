import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
  neo4jInstanceId?: string[]; // Add this field
}

const userSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentRole: {
    type: String,
    required: true,
  },
  purpose: [{
    type: String,
    required: true,
  }],
  skills: [{
    type: String,
    required: true,
  }],
  neo4jInstanceId: [{
    type: String,
    required: false, // Optional field
  }],
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
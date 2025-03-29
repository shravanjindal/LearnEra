import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  skill: string;
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Enum for predefined difficulty levels
  content: string;
}

const taskSchema: Schema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'], // Restrict difficulty to these values
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

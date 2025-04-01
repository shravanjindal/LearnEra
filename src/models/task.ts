import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  skill: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

const taskSchema: Schema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    content: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    links: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillTracker extends Document {
  skill: string;
  tasksDone: {
    taskId: mongoose.Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    feedback: string;
    rating: number;
  }[];
  testsTaken: {
    taskId: mongoose.Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    feedback: string;
    rating: number;
    score: number;
  }[];
  topicsLearnt: string[];
  progress: number;
}

const skillTrackerSchema: Schema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  tasksDone: [
    {
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },
      feedback: {
        type: String,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
  testsTaken: [
    {
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },
      feedback: {
        type: String,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  ],
  topicsLearnt: [
    {
      type: String,
    },
  ],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

export const SkillTracker =
  mongoose.models.SkillTracker ||
  mongoose.model<ISkillTracker>("SkillTracker", skillTrackerSchema);


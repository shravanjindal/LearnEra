import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillTracker extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  skill: string;
  tasksDone: {
    topic: string;
    taskId: mongoose.Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    feedback: string;
    rating: number;
  }[];
  testsTaken: {
    topic: string;
    taskId: mongoose.Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    feedback: string;
    rating: number;
    score: number;
  }[];
  progress: number;
}

const skillTrackerSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  skill: {
    type: String,
    required: true,
  },
  tasksDone: [
    {
      topic: {
        type:String,
      },
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
      topic: {
        type: String,
      },
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


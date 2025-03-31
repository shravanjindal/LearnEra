import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
  skillTracker: {
    skill:string;
    trackerId: mongoose.Schema.Types.ObjectId;
    progress:number,
    tasksDone:number,
  }[];
  badges: string[];
  streakData: {
    date : Date,
    submissions : number,
  }[];
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
  purpose: [
    {
      type: String,
      required: true,
    }
  ],
  skills: [
    {
      type: String,
      required: true,
    }
  ],
  skillTracker:[
    {
      skill:{
        type:String,
      },
      trackerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "skillTrackers"
      },
      progress:{
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      tasksDone:{
        type:Number,
        default: 0,
      }
    }
  ],
  badges:[{
    type: String
  }],
  streakData: [{
    date : Date,
    submissions : Number,
  }]
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

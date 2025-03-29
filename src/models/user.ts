import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
  tasksDone: mongoose.Types.ObjectId[];
  testsTaken: {
    testId: mongoose.Types.ObjectId;
    score: number;
    tutorComments : string;
    userFeedback :string;
  }[];
  skillProgress: {
    skill:string;
    progress:number;
  }[];
  badges: string[];
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
  tasksDone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    }
  ],
  testsTaken: [
    {
      testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
      },
      score: {
        type: Number,
      },
      tutorComments:{
        type: String,
      },
      userFeedback:{
        type: String,
      }
    }
  ],
  skillProgress:[
    {
      skill:{
        type:String,
      },
      progress:{
        type:Number,
      }
    }
  ],
  badges:[{
    type: String
  }]
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

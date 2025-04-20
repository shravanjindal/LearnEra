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
    _id: mongoose.Schema.Types.ObjectId;
  }[];
  badges: string[];
  isVerified: boolean;
  tokenBalance: number;
  isPremium: boolean;
  createdAt: Date;
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
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
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
      _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillTracker"
      },
    }
  ],
  badges:[{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  tokenBalance: {
    type: Number,
    default: 100,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

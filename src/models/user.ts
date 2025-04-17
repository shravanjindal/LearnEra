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
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// pages/api/createUser.ts
import dbConnect from '@/lib/dbConnect';
import {User} from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SkillTracker } from '@/models/skillTracker';
import { IUser } from "@/models/user";
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const userDetails: IUser = await request.json();
    // Connect to the database
    await dbConnect();

    // Check if the email already exists
    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // adding skill progress == 0
    const skills = userDetails.skills;
    let skillTracker = skills.map((e)=>{
      return {
        skill : e,
      }
    });
    let userSkillTrackers = await Promise.all(
      skillTracker.map(async (tracker) => {
        const newTracker = new SkillTracker(tracker);
        const instance = await newTracker.save();
        return { skill: tracker.skill, _id: instance._id };
      })
    );
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);

    // Create a new user with the hashed password
    const newUser = new User({ ...userDetails, password: hashedPassword, skillTracker: userSkillTrackers, streakData: []});

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Store JWT token in the user document
    newUser.token = token;
    console.log(newUser)
    const addedUser = await newUser.save();
    // Iterate over each skillTracker and update it with the userId
    await Promise.all(
      addedUser.skillTracker.map(async (tracker: { _id: mongoose.Schema.Types.ObjectId }) => {
        await SkillTracker.findByIdAndUpdate(tracker._id, { userId: addedUser._id });
      })
    );
    return NextResponse.json(
      { message: 'User created successfully', user: newUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user.' },
      { status: 500 }
    );
  }
}

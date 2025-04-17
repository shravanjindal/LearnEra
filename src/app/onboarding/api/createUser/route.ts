import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SkillTracker } from '@/models/skillTracker';
import { IUser } from "@/models/user";
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'; // Import Nodemailer

// Function to send verification email
const sendVerificationEmail = async (userEmail: string, verificationToken: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail, replace with your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Email Verification',
    html: `<h1>Click <a href="${verificationUrl}">here</a> to verify your email address.</h1>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send verification email.');
  }
};

export async function POST(request: Request) {
  try {
    const userDetails: IUser = await request.json();

    // Make sure the database is connected before proceeding
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Process skills for skillTracker
    const skillTracker = userDetails.skills.map((e) => ({
      skill: e,
    }));

    const userSkillTrackers = await Promise.all(
      skillTracker.map(async (tracker) => {
        const newTracker = new SkillTracker(tracker);
        const instance = await newTracker.save();
        return { skill: tracker.skill, _id: instance._id };
      })
    );

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);

    // Create a new user
    const newUser = new User({
      ...userDetails,
      password: hashedPassword,
      skillTracker: userSkillTrackers,
    });

    // Generate JWT token for the user
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    newUser.token = token;

    // Save the new user
    const addedUser = await newUser.save();

    // Generate a verification token for email
    const verificationToken = jwt.sign(
      { userId: addedUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Send verification email
    await sendVerificationEmail(addedUser.email, verificationToken);

    // Update skillTracker with the userId
    await Promise.all(
      addedUser.skillTracker.map(async (tracker: { _id: mongoose.Schema.Types.ObjectId }) => {
        await SkillTracker.findByIdAndUpdate(tracker._id, { userId: addedUser._id });
      })
    );

    return NextResponse.json(
      { message: 'Please check your email to verify your account.', user: newUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to create user';

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

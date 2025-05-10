import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SkillTracker } from '@/models/skillTracker';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'; // Import Nodemailer
import { FormData } from '@/utils/utils';
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
    subject: 'Verify your email address - Zovite',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4a4a4a;">Welcome to <span style="color: #3f51b5;">Zovite</span>!</h2>
        <p>Hi there,</p>
        <p>Thanks for signing up for <strong>Zovite</strong> - your personalized AI-powered learning platform.</p>
        <p>To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3f51b5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email</a>
        </div>
  
        <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
  
        <p style="margin-top: 40px; font-size: 0.9em; color: #666;">If you didn't sign up for Zovite, you can ignore this email.</p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email: ', error);
    // throw new Error('Failed to send verification email');
  }
};

export async function POST(request: Request) {
  try {
    const userDetails: FormData = await request.json();

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

    const userSkillTrackers = await Promise.all(
      userDetails.skills.map(async (skill) => {
        const newTracker = new SkillTracker({});
        const instance = await newTracker.save();
        return { skill , _id: instance._id };
      })
    );

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);
    
    // Remove the skills from userDetails
    const { skills, ...userDetailsWithoutSkills } = userDetails;

    // Create a new user
    const newUser = new User({
      ...userDetailsWithoutSkills,
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
      { expiresIn: '1h' }
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

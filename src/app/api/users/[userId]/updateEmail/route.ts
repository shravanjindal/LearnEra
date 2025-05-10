import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {User} from "@/models/user";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
export async function POST(req: NextRequest, context: { params: Promise<{ userId: string }> }) {

  await dbConnect();

  try {
    const {userId} = await context.params;
    const {email } = await req.json();
    const user = await User.findByIdAndUpdate(userId, {email}, {new : true});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
  
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Resend Email Verification',
        html: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
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
        </div>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      return NextResponse.json({ message: `Verification email resent successfully to ${email}` }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

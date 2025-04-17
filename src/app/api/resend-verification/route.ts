import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/user';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
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
      html: `<h2>Click <a href="${verificationUrl}">here</a> to verify your email address.</h2>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Verification email resent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error in resend-verification:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

// pages/api/login.ts
import dbConnect from '@/lib/dbConnect';
import {User} from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request: Request) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Connect to database
    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { message: 'Login successful', token, user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    );
  }
}

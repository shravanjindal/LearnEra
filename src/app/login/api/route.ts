// pages/api/login.ts
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    // Set token in HttpOnly cookie
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`
    );  
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    );
  }
}

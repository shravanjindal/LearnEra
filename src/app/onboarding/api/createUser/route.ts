// pages/api/createUser.ts
import dbConnect from '@/lib/dbConnect'; // Utility to connect to your database
import {User} from '@/models/user'; // Your User model
import { NextResponse } from 'next/server';

// Define the type for the user details
type UserDetails = {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
};

export async function POST(request: Request) {
  try {
    // Parse the request body and assert it as UserDetails
    const userDetails: UserDetails = await request.json();

    // Connect to the database
    await dbConnect();

    // Create a new user in the database
    const newUser = new User(userDetails);

    // Save the user to the database
    await newUser.save();
    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
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
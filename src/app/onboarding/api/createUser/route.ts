// pages/api/createUser.ts
import dbConnect from '@/lib/dbConnect'; // Utility to connect to your database
import {User} from '@/models/user'; // Your User model
import { NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/roadmapGenerator'; // Function to generate roadmap
import { createNeo4jInstance } from '@/lib/neo4jUtils'; // Function to create Neo4j instance
import { linkNeo4jToMongoDB } from '@/lib/mongoUtils'; // Function to link Neo4j instance to MongoDB

// Define the type for the user details
type UserDetails = {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
  neo4jInstanceId?: string[]; // Add this field
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

    // Step 1: Generate roadmap using LLM
    const goal = userDetails.skills[0]; // Use the user's purpose as the goal
    const roadmap = await generateRoadmap(goal);

    // Step 2: Create Neo4j instance for the user
    await createNeo4jInstance(newUser._id.toString(), roadmap);

    // Step 3: Link Neo4j instance to MongoDB
    const neo4jInstanceId = `neo4j-instance-${newUser._id}`; // Generate a unique ID
    await linkNeo4jToMongoDB(newUser._id.toString(), neo4jInstanceId);

    // Respond with success
    return NextResponse.json(
      { message: 'User created successfully!', user: newUser },
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
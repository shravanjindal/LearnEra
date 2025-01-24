import { User } from "@/models/user"; // Import the existing User model
import mongoose from "mongoose";

// Function to link Neo4j instance to MongoDB
export async function linkNeo4jToMongoDB(userId: string, neo4jInstanceId: string): Promise<void> {
  try {
    // Connect to MongoDB (if not already connected)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Find the user by ID and update the Neo4j instance ID
    const user = await User.findByIdAndUpdate(
      userId,
      { neo4jInstanceId },
      { upsert: true, new: true } // Create the document if it doesn't exist
    );

    if (!user) {
      throw new Error("User not found and could not be created.");
    }

    console.log("Neo4j instance linked to MongoDB successfully!");
  } catch (error) {
    console.error("Error linking Neo4j instance to MongoDB:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
}
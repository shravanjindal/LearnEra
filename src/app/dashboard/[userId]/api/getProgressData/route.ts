import { NextResponse } from "next/server";
import { User } from "@/models/user";  // Assuming you have the User model imported
import mongoose from "mongoose";
import { ISkillTracker } from "@/models/skillTracker";
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    // Find the user by userId and populate the skillTracker field
    const user = await User.findById(userId).populate("skillTracker._id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Collect progress data from each skill tracker
    const progressData = user.skillTracker.map((tracker : { _id: ISkillTracker }) => ({
      skill: tracker._id.skill,
      progress: tracker._id.progress,
    }));

    // Return the progress data as a response
    return NextResponse.json(progressData);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching progress data" }, { status: 500 });
  }
}

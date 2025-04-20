import { NextRequest, NextResponse } from "next/server";
import {User} from "@/models/user";
import {SkillTracker} from "@/models/skillTracker";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { userId, skill, taskId, startTime, endTime, feedback, rating, topic } = await req.json();

    if (!userId || !skill || !taskId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    dbConnect();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find skill tracker for the given skill
    const skillTracker = user.skillTracker.find((tracker: any) => tracker.skill === skill);
    if (!skillTracker) {
      return NextResponse.json({ error: "Skill tracker not found" }, { status: 404 });
    }

    // Find the skill tracker instance
    const tracker = await SkillTracker.findById(skillTracker._id);
    if (!tracker) {
      return NextResponse.json({ error: "Tracker not found" }, { status: 404 });
    }
    tracker.progress += 0.5;
    // Update tasksDone
    tracker.tasksDone.push({
      topic,
      taskId,
      startTime,
      endTime,
      feedback,
      rating,
    });

    await tracker.save();

    return NextResponse.json({ message: "User progress updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

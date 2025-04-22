import { NextRequest, NextResponse } from "next/server";
import { SkillTracker } from "@/models/skillTracker";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest, context : { params: Promise<{ trackerId: string }> }) {
  try {
    const { trackerId }= await context.params;

    const { taskId, startTime, endTime, feedback, rating, topic, skill } = await req.json();
    
    if (!trackerId || !taskId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const tracker = await SkillTracker.findById(trackerId);
    if (!tracker) {
      return NextResponse.json({ error: "Tracker not found" }, { status: 404 });
    }

    tracker.progress += 0.5;
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

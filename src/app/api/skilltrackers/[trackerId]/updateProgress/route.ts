import { NextRequest, NextResponse } from "next/server";
import { SkillTracker } from "@/models/skillTracker";
import dbConnect from "@/lib/dbConnect";

// Function to calculate elapsed time in minutes
const calculateProgress = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const elapsed = end - start; // milliseconds
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  const totalMinutes = 100 * 60; // 100 hours = 6000 minutes
  const rawProgress = (minutes + seconds / 60) / totalMinutes;
  const progress = Number(Math.min(Math.max(rawProgress, 0)*100, 1).toFixed(1));
  return progress;
};

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
    const progress = calculateProgress(startTime, endTime)
    tracker.progress += progress;
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

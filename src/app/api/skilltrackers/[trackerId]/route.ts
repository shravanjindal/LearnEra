import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {SkillTracker} from "@/models/skillTracker";

export async function GET(req: NextRequest, context: { params: Promise<{ trackerId: string }> }) {
  await dbConnect();

  try {
    const {trackerId} = await context.params;
    const skillTracker = await SkillTracker.findById(trackerId).populate({
      path: 'tasksDone.taskId',
      select: 'task'  // Only populate the 'task' field from the Task model
    });
    if (!skillTracker) {
      return NextResponse.json({ error: "Skill tracker not found" }, { status: 404 });
    }
    console.log("Skill tracker fetched:", skillTracker);
    return NextResponse.json(skillTracker);
  } catch (error) {
    console.error("Error fetching skill tracker:", error);
    return NextResponse.json({ error: "Failed to fetch skill tracker data" }, { status: 500 });
  }
}

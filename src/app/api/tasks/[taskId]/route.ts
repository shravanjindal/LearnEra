import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Task } from "@/models/task";
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  await dbConnect();

  try {
    const { taskId } = await context.params;
    // Validate taskId format
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
    }

    // Fetch the task itself
    const task = await Task.findById(taskId).lean();
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    // console.log("Task fetched:", task);
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task with feedback:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

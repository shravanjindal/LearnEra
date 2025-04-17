import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { SkillTracker } from "@/models/skillTracker";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { trackerId: string } }
) {
  await dbConnect();

  try {
    const trackerId = new mongoose.Types.ObjectId(params.trackerId);
    const skillTracker = await SkillTracker.findById(trackerId);

    if (!skillTracker) {
      return NextResponse.json({ error: "Skill tracker not found" }, { status: 404 });
    }

    return NextResponse.json(skillTracker);
  } catch (error) {
    console.error("Error fetching skill tracker:", error);
    return NextResponse.json({ error: "Failed to fetch skill tracker data" }, { status: 500 });
  }
}

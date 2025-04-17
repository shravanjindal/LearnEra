import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { SkillTracker } from "@/models/skillTracker";

import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const trackerId = segments[segments.length - 1]; // last segment of the URL

    const id = new mongoose.Types.ObjectId(trackerId);
    const skillTracker = await SkillTracker.findById(id);

    if (!skillTracker) {
      return NextResponse.json({ error: "Skill tracker not found" }, { status: 404 });
    }

    return NextResponse.json(skillTracker);
  } catch (error) {
    console.error("Error fetching skill tracker:", error);
    return NextResponse.json({ error: "Failed to fetch skill tracker data" }, { status: 500 });
  }
}

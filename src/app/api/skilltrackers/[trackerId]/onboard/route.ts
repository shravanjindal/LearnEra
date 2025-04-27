import { NextResponse } from "next/server";
import { SkillTracker } from "@/models/skillTracker";

export async function POST(req: Request, context: { params: Promise<{ trackerId: string }> }) {
  const { trackerId } = await context.params;

  try {
    const { skill, learningGoal, currentLevel } = await req.json();

    const tracker = await SkillTracker.findByIdAndUpdate(trackerId, {learningGoal, currentLevel}, { new: true });
    if (!tracker) {
      return NextResponse.json({ error: "Tracker not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill onboarding completed" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

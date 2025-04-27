import { NextResponse } from "next/server";
import { User } from "@/models/user";
import { SkillTracker } from "@/models/skillTracker";

export async function POST(req: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { skill } = await req.json();
    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 });
    }

    const normalizedSkill = skill.toLowerCase();

    // Remove corresponding SkillTracker entry
    const trackerEntry = user.skillTracker.find(
    (entry: { skill: string }) => entry.skill.toLowerCase() === normalizedSkill
    );

    if (trackerEntry) {
      await SkillTracker.findByIdAndDelete(trackerEntry._id);

      // Remove tracker reference from user
      user.skillTracker = user.skillTracker.filter(
          (entry: { skill: string }) => entry.skill.toLowerCase() !== normalizedSkill
      );
    }


    await user.save();

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

    const skillExists = user.skills.includes(skill.toLowerCase());
    if (skillExists) {
      return NextResponse.json({ error: "Skill already exists" }, { status: 400 });
    }

    // Add to skills array
    user.skills.push(skill.toLowerCase());

    // Create a new SkillTracker entry
    const newSkillTracker = await SkillTracker.create({
      userId,
      skill: skill.toLowerCase(),
      progress: 0,
      tasksDone: [],
    });

    // Add tracker ref to user
    user.skillTracker.push({
      skill: skill.toLowerCase(),
      _id: newSkillTracker._id,
    });

    await user.save();

    return NextResponse.json({ message: "Skill added successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";

export async function DELETE(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  await dbConnect();

  try {
    const { userId } = await context.params;
    const { goalIdx } = await req.json(); // expecting { goal: "goal to delete" }


    const user = await User.findByIdAndUpdate(userId);
    if (user) {
      user.purpose.splice(goalIdx, 1);
      await user.save();
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Goal removed successfully", user });
  } catch (error) {
    console.log(error)
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}

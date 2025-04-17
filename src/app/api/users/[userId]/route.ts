import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {User} from "@/models/user";

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  await dbConnect();

  try {
    const {userId} = await context.params;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

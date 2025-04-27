import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  await dbConnect();
  const { userId } = await context.params;

  try {
    const user = await User.findById(userId).populate("skillTracker._id");
    if (!user || !user.skillTracker) {
      return NextResponse.json({ error: "User or skills not found" }, { status: 404 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(now.getDate() - (6 - i));
      return daysMap[day.getDay()];
    });

    const skillProgress = user.skillTracker.map(({ skill, _id } : any) => {
      let isOnboarded = false;
      let taskCounts: Record<string, number> = Object.fromEntries(last7Days.map((d) => [d, 0]));
      if (_id?.currentLevel) {isOnboarded = true;}
      if (_id?.tasksDone) {
        _id.tasksDone
          .filter((task: any) => task.endTime >= sevenDaysAgo)
          .forEach((task: any) => {
            const day = daysMap[new Date(task.endTime).getDay()];
            taskCounts[day]++;
          });
      }

      const data = last7Days.map((day) => ({ day, tasks: taskCounts[day] || 0 }));
      return { idx: _id._id, skill,isOnboarded, data };
    });

    return NextResponse.json(skillProgress);
  } catch (err) {
    console.error("Skilltrackers error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

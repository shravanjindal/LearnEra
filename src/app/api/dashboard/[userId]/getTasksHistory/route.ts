import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();

    const { userId } = await context.params;

    // Fetch user with skillTracker populated
    const user = await User.findById(userId).populate("skillTracker._id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract tasks from all skillTrackers
    const tasks: { trackerId:string, taskId:string,date: Date; topic: string; skill: string }[] = [];

     // Extract tasks from tasksDone array across all skillTrackers
     user.skillTracker.forEach((tracker: any) => {
        const skill = tracker.skill;
        const trackerId = tracker._id._id;
        if (tracker._id?.tasksDone) {
          tracker._id.tasksDone.forEach((task: any) => {
            if (task.topic && task.endTime) {
              // console.log(trackerId)
              tasks.push({ trackerId, taskId: task.taskId,date: task.endTime, topic: task.topic, skill });
            }
          });
        }
      });
    // Sort tasks by date (most recent first) and get the latest 10
    tasks.sort((a, b) => b.date.getTime() - a.date.getTime());
    const latestTasks = tasks.slice(0, 10);
    return NextResponse.json(latestTasks);
  } catch (error) {
    console.error("Error fetching task history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

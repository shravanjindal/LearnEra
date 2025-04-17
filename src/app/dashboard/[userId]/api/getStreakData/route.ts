import { NextResponse } from "next/server";
import { User } from "@/models/user";  // Assuming you have the User model imported

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    // Find the user by userId and populate the skillTracker field
    const user = await User.findById(userId).populate("skillTracker._id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize streak data
    const streakData: { date: string, submissions: number }[] = [];

    // Iterate over each skill tracker
    for (const tracker of user.skillTracker) {
      if (tracker._id.tasksDone) {
        // Iterate through tasksDone to collect the streak data
        for (const task of tracker._id.tasksDone) {
          // Check if endTime exists to count the streak
          if (task.endTime) {
            const taskDate = task.endTime.toISOString().split('T')[0]; // Get the date part (YYYY-MM-DD)

            // Check if this date is already in streakData
            const existingStreak = streakData.find(streak => streak.date === taskDate);

            if (existingStreak) {
              // If the date exists, increment the submission count
              existingStreak.submissions += 1;
            } else {
              // If the date doesn't exist, create a new entry for this date
              streakData.push({
                date: taskDate,
                submissions: 1,
              });
            }
          }
        }
      }
    }

    // Return the aggregated streak data as a response
    return NextResponse.json(streakData);
  } catch (err) {
    return NextResponse.json({ error: `Error fetching streak data : ${err}` }, { status: 500 });
  }
}

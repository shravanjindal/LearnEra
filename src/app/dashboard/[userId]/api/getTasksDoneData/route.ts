import { NextResponse } from "next/server";
import { User } from "@/models/user";  // Assuming you have the User model imported
import { ISkillTracker } from "@/models/skillTracker";
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    // Find the user by userId and populate the skillTracker field
    const user = await User.findById(userId).populate("skillTracker._id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tasksDoneData = user.skillTracker.map((tracker : { _id: ISkillTracker }) => {
      const tasksDone = tracker._id.tasksDone ? tracker._id.tasksDone.length : 0;  // Count the number of tasks done
      return {
        skill: tracker._id.skill,
        tasksDone,
      };
    });

    // Return the tasks done data as a response
    return NextResponse.json(tasksDoneData);
  } catch (err) {
    return NextResponse.json({ error: `Error fetching tasks done data : ${err}` }, { status: 500 });
  }
}

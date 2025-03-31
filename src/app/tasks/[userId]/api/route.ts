import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import { SkillTracker } from "@/models/skillTracker";
import mongoose from "mongoose";

// TypeScript Interfaces
interface Task {
    endTime: Date;
}

interface SkillTrackerDocument {
    skill: string;
    tasksDone: Task[];
}

interface UserDocument {
    skillTracker: { skill: string; _id: SkillTrackerDocument }[];
}

// Handle GET request
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    await dbConnect();

    let { userId } = await params;
    userId = userId.toString();
    try {
        console.log(mongoose.modelNames());
        console.log("--------------------------------");

        const user: UserDocument | null = await User.findById(userId).populate("skillTracker._id");
        console.log("--------------------------------");
        console.log(user?.skillTracker[0]._id);
        if (!user || !user.skillTracker) {
            return NextResponse.json({ error: "User or skills not found" }, { status: 404 });
        }

        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);

        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Create an array for last 7 days in correct order
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const day = new Date();
            day.setDate(now.getDate() - (6 - i)); // Ensures correct order (Mon-Sun)
            return daysMap[day.getDay()];
        });

        const skillProgress = user.skillTracker.map(({ skill, _id }) => {
            // Default 7 days structure with 0 tasks
            let taskCounts: Record<string, number> = Object.fromEntries(
                last7Days.map((day) => [day, 0])
            );

            if (_id?.tasksDone) {
                const recentTasks = _id.tasksDone.filter(
                    (task) => task.endTime >= sevenDaysAgo
                );

                recentTasks.forEach((task) => {
                    const day = daysMap[new Date(task.endTime).getDay()];
                    taskCounts[day]++;
                });
            }

            const data = last7Days.map((day) => ({
                day,
                tasks: taskCounts[day] || 0,
            }));

            return { skill, data };
        });

        return NextResponse.json(skillProgress, { status: 200 });
    } catch (error) {
        console.error("Error fetching skill progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

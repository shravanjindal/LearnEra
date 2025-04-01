"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import UserDetails from "@/components/dashboard/UserDetails";
import UserSkillBars from "@/components/dashboard/UserSkillBars";
import PieChartCard from "@/components/dashboard/PieChartCard";
import BadgesCard from "@/components/dashboard/BadgesCard";
import StreakGrid from "@/components/dashboard/StreakGrid";
import ProgressCarousel from "@/components/dashboard/ProgressCarousel";
import TaskHistory from "@/components/dashboard/TaskHistory";
import Chatbot from "@/components/dashboard/Chatbot";
import { IUser } from "../../../models/user";

const Dashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<(IUser & { _id: string }) | null>(null);
  const [streakData, setStreakData] = useState<{ date: Date; submissions: number }[]>([]);
  const [progressData, setProgressData] = useState<{ skill: string; progress: number }[]>([]);
  const [tasksDoneData, setTasksDoneData] = useState<{ skill: string; tasksDone: number }[]>([]);
  const [tasksHistoryData, setTasksHistoryData] = useState<{ date: Date; topic: string; skill: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/dashboard/${userId}/api`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);

        // Fetch the streak data after user data
        const streakResponse = await fetch(`/dashboard/${userId}/api/getStreakData`);
        if (!streakResponse.ok) throw new Error("Failed to fetch streak data");

        const streakData = await streakResponse.json();
        setStreakData(streakData);

        // Fetch progress data
        const progressResponse = await fetch(`/dashboard/${userId}/api/getProgressData`);
        if (!progressResponse.ok) throw new Error("Failed to fetch progress data");

        const progressData = await progressResponse.json();
        setProgressData(progressData);

        // Fetch tasks done data
        const tasksDoneResponse = await fetch(`/dashboard/${userId}/api/getTasksDoneData`);
        if (!tasksDoneResponse.ok) throw new Error("Failed to fetch tasks done data");

        const tasksDoneData = await tasksDoneResponse.json();
        setTasksDoneData(tasksDoneData);

        // Fetch tasks history data
        const tasksHistoryResponse = await fetch(`/dashboard/${userId}/api/getTasksHistory`);
        if (!tasksHistoryResponse.ok) throw new Error("Failed to fetch tasks history");

        const tasksHistoryData = await tasksHistoryResponse.json();
        setTasksHistoryData(Array.isArray(tasksHistoryData) ? tasksHistoryData : []);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    );
  
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <Navbar user={{ name: user.name, streak: 0, id: user._id.toString() }} />
      <div className="container flex p-4 overflow-y-auto scrollbar-custom">
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg mr-4">
          <UserDetails user={{ name: user.name, badges: user.badges }} />
          <UserSkillBars skillProgressData={progressData} />
        </div>
        <div className="w-3/4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PieChartCard tasksDoneData={tasksDoneData} />
            <BadgesCard user={{ badges: user.badges }} />
          </div>
          <StreakGrid streakData={streakData} />
          <div id="progress-section">
            {/* <ProgressCarousel user={user} performanceData={user} /> */}
          </div>
          <TaskHistory taskHistory={tasksHistoryData} />
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;

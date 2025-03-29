"use client"
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
import mongoose from "mongoose";

interface IUser {
  _id: string,
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
  tasksDone: {
    date:Date,
    task:mongoose.Types.ObjectId,
    skill:string,
  }[];
  testsTaken: {
    testId: mongoose.Types.ObjectId;
    score: number;
    tutorComments : string;
    userFeedback :string;
  }[];
  skillProgress: {
    skill:string;
    progress:number;
  }[];
  badges:string[];
}

const Dashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
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
        console.log(data)
        setUser(data);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <Navbar user={{name : user.name, streak: 0, id : user._id}} />
      <div className="container flex p-4 overflow-y-auto scrollbar-custom">
  <div className="w-1/4 bg-gray-800 p-4 rounded-lg mr-4">
    <UserDetails user={{name : user.name, badges: user.badges}} />
    <UserSkillBars skillProgressData={user.skillProgress} />
  </div>
  <div className="w-3/4 flex-1">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <PieChartCard tasksDoneData={user.skillProgress} />
      <BadgesCard user={{badges: user.badges}} />
    </div>
    <StreakGrid />
    <div id="progress-section">
      {/* <ProgressCarousel user={user} performanceData={user} /> */}
    </div>
    <TaskHistory taskHistory={[]} />
  </div>
</div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;

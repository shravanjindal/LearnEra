"use client";
import React, { use, useState } from "react";

import Navbar from "@/components/dashboard/Navbar";
import UserDetails from "@/components/dashboard/UserDetails";
import UserSkillBars from "@/components/dashboard/UserSkillBars";
import PieChartCard from "@/components/dashboard/PieChartCard";
import BadgesCard from "@/components/dashboard/BadgesCard";
import StreakGrid from "@/components/dashboard/StreakGrid";
import ProgressCarousel from "@/components/dashboard/ProgressCarousel";
import TaskHistory from "@/components/dashboard/TaskHistory";

const Dashboard = () => {
  // Sample data
  const user = {
    name: "Shravan Jindal",
    rank: "1,368,045",
    solved: 73,
    streak: 4,
    badges: ["2022 Code Beginner", "4. Allen Coding Challenge"],
    skills: ["Web Development", "Data Science", "Machine Learning"],
  };

  const skillProgressData = [
    { skill: "Web Development", progress: 75 },
    { skill: "Data Science", progress: 50 },
    { skill: "Machine Learning", progress: 90 },
  ];

  const tasksDoneData = [
    { skill: "Web Development", tasks: 30 },
    { skill: "Data Science", tasks: 15 },
    { skill: "Machine Learning", tasks: 25 },
  ];

  const performanceData = [
    { month: "Jan", score: 60 },
    { month: "Feb", score: 75 },
    { month: "Mar", score: 80 },
    { month: "Apr", score: 85 },
    { month: "May", score: 90 },
  ];

  const taskHistory = [
    { date: "2023-10-01", task: "Responsive navbar with HTML and CSS", skill: "Web Development" },
    { date: "2023-10-05", task: "Routing using ExpressJS", skill: "Web Development" },
    { date: "2023-10-10", task: "Exploring Standard Scalar", skill: "Data Science" },
  ];
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <Navbar user={user}/>
      <div className="container flex p-4 overflow-y-auto scrollbar-custom">
        <div className="bg-gray-800 p-4 rounded-lg mr-4">
          <UserDetails user={user}/>
          <UserSkillBars skillProgressData={skillProgressData}/>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PieChartCard tasksDoneData={tasksDoneData}/>
            <BadgesCard user={user}/>
          </div>
          <StreakGrid />
          <ProgressCarousel user={user} performanceData={performanceData}/>
          <TaskHistory taskHistory={taskHistory}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
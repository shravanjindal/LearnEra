"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Dashboard = () => {
  const [selectedSkill, setSelectedSkill] = useState("Web Development");
  const [streak, setStreak] = useState(4); // Example streak value

  // Sample data
  const user = {
    name: "Shravan Jindal",
    rank: "1,368,045",
    solved: 73,
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
    { date: "2023-10-01", task: "Solved 'Two Sum'", skill: "Web Development" },
    { date: "2023-10-05", task: "Solved 'Reverse Linked List'", skill: "Web Development" },
    { date: "2023-10-10", task: "Solved 'Binary Search'", skill: "Data Science" },
  ];

  const days = Array.from({ length: 365 }, (_, i) => ({
    date: i,
    submissions: Math.floor(Math.random() * 4), // Random submission count for demo
  }));

  const getColor = (submissions) => {
    if (submissions === 1) return "bg-green-300";
    if (submissions === 2) return "bg-green-500";
    if (submissions >= 3) return "bg-green-700";
    return "bg-gray-200"; // No submissions
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Colors for donut chart

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {/* Navbar on Top */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">LearnEra</h1>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">Explore</a>
            <a href="#" className="text-gray-300 hover:text-white">Problems</a>
            <a href="#" className="text-gray-300 hover:text-white">Contest</a>
            <a href="#" className="text-gray-300 hover:text-white">Discuss</a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Streak:</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${streak > 0 ? "bg-green-500" : "bg-gray-700"}`}>
                <span className="text-sm">{streak}</span>
              </div>
            </div>
            <span className="text-sm">{user.name}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex p-4 overflow-y-auto scrollbar-custom">
        {/* Left Section - User Description and Skills Progress */}
        <div className="bg-gray-800 p-4 rounded-lg mr-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-xs text-gray-400">Solved Tasks: {user.solved}</p>
            <div className="mt-2 space-y-1">
              {user.badges.map((badge, index) => (
                <Badge key={index} className="bg-purple-500 text-white">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold">Skills Progress</h3>
            {skillProgressData.map((item, index) => (
              <div key={index} className="mt-3">
                <p className="text-sm mb-1 text-gray-300">{item.skill}</p>
                <Progress value={item.progress} className="h-2 mb-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          {/* Top Section - Donut Chart and Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg font-bold">Tasks Done</CardTitle>
                <CardDescription className="text-gray-300">Tasks completed for each skill</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tasksDoneData}
                      dataKey="tasks"
                      nameKey="skill"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationDuration={1000}
                      animationBegin={0}
                    >
                      {tasksDoneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "#F3F4F6", paddingTop: "10px" }}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg font-bold">Badges</CardTitle>
                <CardDescription className="text-gray-300">Your earned badges</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Middle Section - Streak Table */}
          <div className="flex justify-center mb-6">
            <div className="w-full p-2">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-md font-semibold">258 submissions in the past one year</h1>
                <div className="text-xs">
                  <p>Total active days: <span className="font-bold">31</span></p>
                  <p>Max streak: <span className="font-bold">4</span></p>
                </div>
              </div>

              {/* Streak Grid */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`w-4.5 h-3 rounded-sm ${getColor(day.submissions)}`}
                    title={`Day ${index + 1}: ${day.submissions} submissions`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Performance Chart and Skill Carousel */}
          <Card className="mb-6 bg-gray-800 border-gray-700 rounded-lg shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-100">
                Performance Over Time
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Track your progress across different skills
              </CardDescription>
            </CardHeader>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full relative group"
            >
              <CarouselContent>
                {user.skills.map((skill, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="p-2">
                      <div className="bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-md font-medium text-gray-100 mb-2">
                          Performance in {skill}
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={performanceData}>
                            <XAxis
                              dataKey="month"
                              stroke="#6B7280"
                              tick={{ fill: "#9CA3AF" }}
                            />
                            <YAxis stroke="#6B7280" tick={{ fill: "#9CA3AF" }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#374151",
                                border: "none",
                                borderRadius: "6px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Legend
                              wrapperStyle={{ color: "#F3F4F6", paddingTop: "10px" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#818CF8"
                              strokeWidth={2}
                              dot={{ r: 4, fill: "#818CF8" }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Custom Previous Button */}
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100" />

              {/* Custom Next Button */}
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100" />
            </Carousel>
          </Card>

          {/* Task History */}
          <Card className="bg-gray-800 border-gray-700 rounded-lg shadow-sm">
            <CardHeader className="border-b border-gray-700 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-100">
                Task History
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Your completed tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2">
                {taskHistory.map((task, index) => (
                  <div
                    key={index}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-100 group-hover:text-blue-400 transition-colors duration-200">
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-200">
                        {task.date}
                      </p>
                    </div>
                    <Badge className="mt-1 sm:mt-0 bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-medium transition-colors duration-200">
                      {task.skill}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
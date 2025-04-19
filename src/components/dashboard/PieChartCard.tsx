import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Tooltip, Legend, PieChart, ResponsiveContainer, Pie } from "recharts";
import { Cell } from "recharts";

type PieChartCardProps = {
  tasksDoneData: {
    skill: string;
    tasksDone: number;
  }[];
};

// Function to generate a random color with alpha (transparency)
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  // Set alpha (opacity) to 0.7 (you can adjust this value as needed)
  return `${color}FF`; // The last two characters '99' represent the alpha in hexadecimal (approximately 60% opacity)
};


const PieChartCard = ({ tasksDoneData }: PieChartCardProps) => {
  let p = false;
  tasksDoneData.map((e) => {
    if (e.tasksDone !== 0) p = true;
  });

  return (
    <Card className="bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-white text-lg font-semibold">
          Tasks Done
        </CardTitle>
        <CardDescription className="text-gray-400">
          Tasks completed for each skill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {!p ? (
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 bg-[#2a2a2a] rounded-full flex items-center justify-center text-white font-bold text-center">
                No tasks <br /> completed
              </div>
            </div>
          ) : (
            <PieChart>
              <Pie
                data={tasksDoneData}
                dataKey="tasksDone"
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
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a2a2a",
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
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;

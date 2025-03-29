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
    skill: String;
    progress: number;
  }[];
};

// Function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PieChartCard = ({ tasksDoneData }: PieChartCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-white text-lg font-bold">
          Tasks Done
        </CardTitle>
        <CardDescription className="text-gray-300">
          Tasks completed for each skill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer className="flex justify-center" width="100%" height={250}>
          {tasksDoneData.length === 0 ? (
            <div className="border-2 border-gray-400 rounded-full w-32 h-32 flex items-center justify-center bg-gray-700">
              <p className="text-sm text-white">No Data</p>
            </div>
          ) : (
            <PieChart>
              <Pie
                data={tasksDoneData}
                dataKey="progress"
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
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;

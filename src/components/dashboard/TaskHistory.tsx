import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TaskHistoryProps = {
  taskHistory: {
    date: Date;
    topic: string;
    skill: string;
  }[];
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const TaskHistory = ({ taskHistory }: TaskHistoryProps) => {
  return (
    <Card className="bg-[#1e1e1e] border-[#2c2c2c] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="border-b border-[#2c2c2c] pb-2">
        <CardTitle className="text-lg font-semibold text-white">
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
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors duration-200 cursor-pointer"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                  {task.topic}
                </p>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-200">
                  {formatDate(new Date(task.date))}
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
  );
};

export default TaskHistory;

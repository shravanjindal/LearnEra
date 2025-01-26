import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TaskHistoryProps = {
    taskHistory: {
        date: string;
        task: string;
        skill: string;
    }[];
}
const TaskHistory = ({ taskHistory }: TaskHistoryProps) => {
    return (
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
    )
}

export default TaskHistory
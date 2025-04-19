"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SkillsToLearn from "@/components/tasks/skillsToLearn";
import TaskList from "@/components/tasks/taskList";
import Task from "@/components/tasks/task";
import TutorChatbot, { Message } from "@/components/tasks/TutorChatbot";
import TutorComments from "@/components/tasks/TutorComments";
import mongoose from "mongoose";
import Chatbot from "@/components/tasks/SmallScreenBot";
// TypeScript Interfaces
interface TaskData1 {
  day: string;
  tasks: number;
}

interface SkillProgress {
  idx: string;
  skill: string;
  data: TaskData1[];
}

interface SelectedTask {
  topic: string;
  description: string;
}
interface TaskData {
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

const TasksPage: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "I have analyzed your progress! Keep going strong! 💪",
    },
  ]);
  const [input, setInput] = useState("");
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchSkillProgress = async () => {
      try {
        const response = await fetch(`/tasks/${userId}/api`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: SkillProgress[] = await response.json();
        setSkillProgress(data);
      } catch (error) {
        console.error("Error fetching skill progress:", error);
      }
    };

    fetchSkillProgress();
  }, [userId]);

  const handleSend = async () => {
    if (!input.trim() || !taskData) return;
  
    // Add user message to local state (optional depending on where this lives)
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
  
    try {
      const res = await fetch(`/tasks/${userId}/api/doubtSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: taskData,
        }),
      });
  
      const data = await res.json();
  
      // Add bot reply
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    }
  
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 overflow-x-hidden">
  <div className="flex flex-col lg:flex-row p-4 md:p-6 overflow-y-auto scrollbar-custom space-y-4 lg:space-y-0 lg:space-x-6">
    
    {selectedTask ? (
      <>
      {/* Task Section */}
      <div className="w-full lg:w-[68vw] bg-[#1e1e1e] p-4 md:p-6 rounded-xl shadow-md">
        <Task
          userId={userId}
          skill={selectedSkill as string}
          topic={selectedTask.topic}
          description={selectedTask.description}
          taskData={taskData}
          setTaskData={setTaskData}
        />
      </div>

      {/* Chatbot Section */}
      <div className="hidden lg:block w-full lg:w-1/3 bg-[#1e1e1e] p-4 md:p-6 rounded-xl shadow-md">
        <TutorChatbot
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
        />
      </div>
      <div className="lg:hidden">
        <Chatbot 
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
        />
      </div>
    </>
    ) : selectedSkill ? (
      <div className="w-full p-8">
        <TutorComments />
        <TaskList
          skill={selectedSkill}
          onGoBack={() => setSelectedSkill(null)}
          userId={userId}
          onStartTask={(task) => setSelectedTask(task)}
        />
      </div>
    ) : (
      <div className="w-full p-8">
        <TutorComments />
        <SkillsToLearn
          skills={skillProgress}
          onSelectSkill={setSelectedSkill}
        />
      </div>
    )}
  </div>
</div>

  );
};

export default TasksPage;

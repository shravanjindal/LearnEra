"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskList from "@/components/tasks/taskList";
import TutorComments from "@/components/tasks/TutorComments";
import Task from "@/components/tasks/task";
import TutorChatbot, { Message } from "@/components/tasks/TutorChatbot";
import Chatbot from "@/components/tasks/SmallScreenBot";
import { useRouter } from "next/navigation";
interface SelectedTask {
  skill: string;
  topic: string;
  description: string;
}

interface TaskData {
  trackerId: string;
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

interface Topic {
  skill: string;
  topic: string;
  description: string;
  prerequisites?: string[];
}

const TopicsAndTaskPage: React.FC = () => {
  const params = useParams();
  const trackerId = params.trackerId as string;
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("User ID from localStorage:", storedUserId);
    } else {
      router.push("/login");
    }
  },[]);
  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/skilltrackers/${trackerId}/getTopics`);
      if (!response.ok) throw new Error("Failed to fetch topics");
      const data = await response.json();
      setTopics(data.generatedTopics || []);
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError("Failed to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskData = async (skill: string, topic: string, description: string) => {
    setError(null);
    setLoading(true);
    // setTaskData(null);
    try {
      const response = await fetch(`/api/tasks/generateTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, topic, description }),
      });

      if (!response.ok) throw new Error("Failed to generate task content");

      const data = await response.json();
      setTaskData({...data, trackerId});
      setLoading(false);
    } catch (err) {
      console.error("Error fetching task:", err);
      setError("Failed to load task. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [trackerId]);

  const handleStartTask = async (task: SelectedTask) => {
    setSelectedTask(task);
    await fetchTaskData(task.skill, task.topic, task.description); // Adjust skill if available
  };

  const handleSend = async () => {
    if (!input.trim() || !taskData) return;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    try {
      const res = await fetch(`/api/skilltrackers/${trackerId}/doubtSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messages.slice(-5), context: taskData, input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    }
  };

  useEffect(() => {
    if (selectedTask) {
      setMessages([
        {
          sender: "bot",
          text: `Hello! I'm here to help you with anything related to ${selectedTask.topic}. Feel free to ask me any questions! 💡`,
        },
      ]);
    }
  }, [selectedTask]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 overflow-x-hidden p-8">
      {!selectedTask ? (
        <>
          <TutorComments />
          <TaskList
            topics={topics}
            loading={loading}
            error={error}
            onRetry={fetchTopics}
            onGoBack={() => {
              router.push(`/dashboard/${userId}/skilltrackers`);
            }}
            onStartTask={handleStartTask}
          />
        </>
      ) : (
        <div className="flex flex-col lg:flex-row p-4 md:p-6 overflow-y-auto scrollbar-custom space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="w-full lg:w-[68vw] bg-[#1e1e1e] p-4 md:p-6 rounded-xl shadow-md">
            <Task
              taskData={taskData}
              isLoading={loading}
              error={error}
              
              onRegenerate={() => fetchTaskData(selectedTask.skill, selectedTask.topic, selectedTask.description)}
            />
          </div>
          <div className="hidden lg:block w-full lg:w-1/3 bg-[#121212] p-4 md:p-6 rounded-xl shadow-md">
            <TutorChatbot messages={messages} input={input} setInput={setInput} handleSend={handleSend} />
          </div>
          <div className="lg:hidden">
            <Chatbot messages={messages} input={input} setInput={setInput} handleSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsAndTaskPage;

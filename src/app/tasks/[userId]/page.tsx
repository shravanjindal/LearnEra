"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ Correct way to get params in Next.js 13+
import TutorComments from "@/components/TutorComments";
import SkillsToLearn from "@/components/tasks/skillsToLearn";
import TaskList from "@/components/tasks/taskList";
import TutorChatbot from "@/components/TutorChatbot";
import { Message } from "@/components/TutorChatbot";

// Define TypeScript Interfaces
interface TaskData {
  day: string;
  tasks: number;
}

interface SkillProgress {
  skill: string;
  data: TaskData[];
}

const difficultyLevels = [
  { level: "Easy", description: "Beginner-friendly task to get started!" },
  { level: "Medium", description: "A balanced challenge for improvement." },
  { level: "Hard", description: "Advanced task to test your skills!" },
];

const TasksPage: React.FC = () => {
  const params = useParams(); // ✅ Use useParams() instead of useRouter()
  const userId = params.userId as string; // Extract userId from URL
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "I have analyzed your progress! Keep going strong! 💪" },
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

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <div className="w-3/4 p-8">
        <TutorComments />
        {selectedSkill ? (
          <TaskList skill={selectedSkill} onGoBack={() => setSelectedSkill(null)} tasks={difficultyLevels} />
        ) : (
          <SkillsToLearn skills={skillProgress} onSelectSkill={setSelectedSkill} />
        )}
      </div>
      <TutorChatbot messages={messages} input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
};

export default TasksPage;

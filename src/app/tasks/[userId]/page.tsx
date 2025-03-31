"use client";
import { useState } from "react";
import TutorComments from "@/components/TutorComments";
import SkillsToLearn from "@/components/tasks/skillsToLearn";
import TaskList from "@/components/tasks/taskList";
import TutorChatbot from "@/components/TutorChatbot";
import { Message } from "@/components/TutorChatbot";

const skillProgress = [
  {
    skill: "Web Development",
    data: [
      { day: "Mon", tasks: 3 },
      { day: "Tue", tasks: 5 },
      { day: "Wed", tasks: 2 },
      { day: "Thu", tasks: 4 },
      { day: "Fri", tasks: 1 },
      { day: "Sat", tasks: 6 },
      { day: "Sun", tasks: 3 },
    ],
  },
  {
    skill: "Machine Learning",
    data: [
      { day: "Mon", tasks: 2 },
      { day: "Tue", tasks: 3 },
      { day: "Wed", tasks: 4 },
      { day: "Thu", tasks: 1 },
      { day: "Fri", tasks: 5 },
      { day: "Sat", tasks: 2 },
      { day: "Sun", tasks: 4 },
    ],
  },
];

const difficultyLevels = [
  { level: "Easy", description: "Beginner-friendly task to get started!" },
  { level: "Medium", description: "A balanced challenge for improvement." },
  { level: "Hard", description: "Advanced task to test your skills!" },
];

const TasksPage = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "I have analyzed your progress! Keep going strong! 💪" },
  ]);  
  const [input, setInput] = useState("");

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

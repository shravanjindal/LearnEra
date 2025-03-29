"use client";
import { useState } from "react";
import TutorChatbot from "@/components/TutorChatbot";
import { Button } from "@/components/ui/button";

// Define test structure
interface Test {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  date?: string; // Only for previous tests
  score?: number; // Only for previous tests
}

// Define message structure
interface Message {
  sender: "bot" | "user";
  text: string;
}

const TestPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Welcome! Need help with your test?" },
  ]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  // New Tests (Multiple)
  const newTests: Test[] = [
    { id: 1, title: "JavaScript Fundamentals", description: "Test your JavaScript skills.", difficulty: "Medium" },
    { id: 2, title: "React Components", description: "Evaluate your React component knowledge.", difficulty: "Hard" },
    { id: 3, title: "Node.js APIs", description: "Test on creating REST APIs using Node.js.", difficulty: "Medium" },
  ];

  // Previous Tests (Table)
  const previousTests: Test[] = [
    { id: 4, title: "HTML & CSS Basics", description: "Test your HTML and CSS knowledge.", difficulty: "Easy", date: "2024-03-20", score: 85 },
    { id: 5, title: "JavaScript Arrays", description: "Test your JavaScript array knowledge.", difficulty: "Medium", date: "2024-03-15", score: 78 },
    { id: 6, title: "React Hooks", description: "Test your React Hooks knowledge.", difficulty: "Hard", date: "2024-03-10", score: 90 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Left Section (3/4 of the page) */}
      <div className="w-3/4 p-6">
        {/* AI Summary Heading */}
        <div className="flex flex-col items-center justify-center text-center">
  <h1 className="text-2xl font-bold mb-4">📊 Tutor Comments</h1>
  <p className="text-gray-300 mb-6">
    Based on your progress, here are some new tests. You can also review your past tests.
  </p>
</div>

        {/* New Tests Section (Multiple Cards) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">🆕 New Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newTests.map((test) => (
              <div key={test.id} className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">{test.title}</h3>
                <p className="text-gray-400 text-sm">{test.description}</p>
                <span className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded mt-2 inline-block">
                  Difficulty: {test.difficulty}
                </span>
                <Button className="mt-4 w-full">Start Test</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Tests Section (Table) */}
        <section>
          <h2 className="text-xl font-semibold mb-3">📜 Previous Tests</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left">Test</th>
                  <th className="p-3 text-left">Difficulty</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {previousTests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-700">
                    <td className="p-3">{test.title}</td>
                    <td className="p-3">{test.difficulty}</td>
                    <td className="p-3">{test.date}</td>
                    <td className="p-3">{test.score}%</td>
                    <td className="p-3">
                      <Button className="text-sm px-3">Review Test</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right Section (1/4 of the page) - Tutor Chatbot */}
      <TutorChatbot messages={messages} input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
};

export default TestPage;

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TasksPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "I have made following task for you. Which one do you want to do today?" },
  ]);
  const [input, setInput] = useState("");

  const userSummary =
    "🚀 Based on your activity, you've shown strong skills in Web Development and Machine Learning. Your problem-solving speed has improved by 15% over the last month! Keep up the great work!";
  
  const tasks = [
    { title: "🌐 Build a Responsive Navbar", description: "Use HTML, CSS, and JavaScript to create a fully responsive navigation bar." },
    { title: "📊 Data Cleaning with Pandas", description: "Learn how to clean and preprocess datasets using Pandas in Python." },
    { title: "🤖 Machine Learning Model Tuning", description: "Optimize hyperparameters for a better-performing ML model." },
    { title: "⚡ Implement a Dark Mode", description: "Use Tailwind CSS to create a toggleable dark mode UI." },
    { title: "🔍 SEO Optimization", description: "Enhance your website's SEO using meta tags and structured data." },
    { title: "🛠 API Integration", description: "Connect a front-end app to an external API and display data dynamically." },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: "I'll help you with that! 😊" },
    ]);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 overflow-auto">
      {/* Left 3/4 Section */}
      <div className="w-3/4 p-8">
        {/* AI Generated Summary */}
        <motion.div
          className="bg-gray-800/80 p-6 rounded-xl shadow-xl backdrop-blur-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">💬 Tutor Comments</h2>
          <p className="text-gray-300">{userSummary}</p>
        </motion.div>

        {/* Task List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">📝 Available Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={index}
                className="p-5 bg-gray-800 rounded-xl shadow-lg backdrop-blur-md hover:bg-gray-700 transition duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-lg font-semibold text-gray-200">{task.title}</h3>
                <p className="text-gray-400">{task.description}</p>
                <Button className="mt-3 bg-black w-full text-white">Start Now</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 1/4 Section - Chatbot */}
      <motion.div
        className="w-1/4 bg-gray-800 p-5 fixed right-0 top-0 h-full flex flex-col shadow-2xl backdrop-blur-lg border-l border-gray-700"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h2 className="text-xl font-semibold">👨🏻‍🏫 Tutor</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 border border-gray-700 rounded">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-lg text-sm ${
                msg.sender === "bot"
                  ? "bg-gray-700 text-left"
                  : "bg-blue-600 text-right"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded text-sm placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <Button
            className="p-3 bg-blue-600 flex-shrink-0"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TasksPage;

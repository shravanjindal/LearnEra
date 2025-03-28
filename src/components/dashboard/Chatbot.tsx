"use client";
import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome back to LearnEra!" },
    { sender: "bot", text: "Let's go to tasks to learn further" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: "I'm here to help!" }]);
    setInput("");
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 flex flex-col items-end"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      {isOpen && (
        <div className="w-72 bg-gray-800 text-gray-100 m-4 p-2 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span className="text-lg font-semibold">👨🏻‍🏫 Tutor</span>
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="h-48 overflow-y-auto mb-2 p-2 border border-gray-700 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-1 p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "bot" ? "bg-gray-700 text-left self-start" : "bg-blue-600 text-right self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center w-full gap-2">
            <input
              type="text"
              className="p-2 flex-1 bg-gray-900 border border-gray-700 rounded text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <Button className="px-2 text-sm" onClick={handleSend} aria-label="Send message">
              📩
            </Button>
          </div>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      <motion.button 
        className="rounded-full p-3 bg-blue-600 shadow-lg" 
        onClick={() => setIsOpen(!isOpen)}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-label="Toggle chatbot"
      >
        <MessageSquare size={24} />
      </motion.button>
    </motion.div>
  );
};

export default Chatbot;

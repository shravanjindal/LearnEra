"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

export interface Message {
  sender: "bot" | "user";
  text: string;
}

interface TutorChatbotProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
}

const TutorChatbot: React.FC<TutorChatbotProps> = ({ messages, input, setInput, handleSend }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(28); // Default width in vw

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle mouse down event for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize"; // Change cursor to resizing
  };

  // Handle mouse move event to adjust width during resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      setWidth(Math.max(20, Math.min(newWidth, 80))); // Restrict to 20% to 40% width
    }
  };

  // Handle mouse up event to stop resizing
  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  };

  // Attach event listeners for mouse move and mouse up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <motion.div
      ref={containerRef}
      className="bg-gray-800 p-5 fixed right-0 top-0 h-full flex flex-col shadow-2xl backdrop-blur-lg border-l border-gray-700 z-50"
      style={{ width: `${width}vw` }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-xl font-semibold">👨🏻‍🏫 Tutor</h2>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 border border-gray-700 rounded scrollable">
        {messages.map((msg: Message, index: number) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              msg.sender === "bot" ? "bg-gray-700 text-left" : "bg-blue-600 text-right"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </motion.div>
        ))}
        {/* 👇 Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded text-sm placeholder-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              handleSend();
            }
          }}
          placeholder="Ask me anything..."
        />
        <Button className="p-3 flex-shrink-0" onClick={handleSend}>
          Send
        </Button>
      </div>

      {/* Resizable Handle */}
      <div
        className="absolute top-0 left-[-5px] w-2 h-full cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
    </motion.div>
  );
};

export default TutorChatbot;

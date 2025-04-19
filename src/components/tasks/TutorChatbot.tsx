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
  className="bg-[#1e1e1e] p-5 fixed right-0 top-0 h-full flex flex-col shadow-2xl backdrop-blur-md border-l border-[#1a1a1a] z-50"
  style={{ width: `${width}vw` }}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Header */}
  <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3 mb-3">
    <h2 className="text-xl font-semibold text-gray-200">👨🏻‍🏫 Tutor</h2>
  </div>

  {/* Messages Section */}
  <div className="flex-1 overflow-y-auto p-3 space-y-2 border border-[#1f1f1f] rounded scrollable bg-[#111]">
    {messages.map((msg: Message, index: number) => (
      <motion.div
        key={index}
        className={`p-3 rounded-lg text-sm ${
          msg.sender === "bot"
            ? "bg-[#2f2f2f] text-gray-200 text-left"
            : "bg-blue-600 text-white text-right"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      </motion.div>
    ))}
    <div ref={messagesEndRef} />
  </div>

  {/* Input Field */}
  <div className="flex gap-2 mt-2">
    <input
      type="text"
      className="flex-1 p-3 bg-[#1a1a1a] border border-[#333] rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && input.trim()) {
          handleSend();
        }
      }}
      placeholder="Ask me anything..."
    />
    <Button className="p-3 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white transition">
      Send
    </Button>
  </div>

  {/* Resizable Handle */}
  <div
      className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-6 h-10 flex items-center justify-center bg-[#1f1f1f] border border-[#2a2a2a] rounded-r-md cursor-ew-resize shadow-sm hover:bg-[#2a2a2a] transition"
      onMouseDown={handleMouseDown}
      title="Resize"
    >
      <span className="text-gray-400 text-xs font-semibold select-none pointer-events-none">
        &#60;&#124;&#124;&#62;
      </span>
    </div>

</motion.div>

  );
};

export default TutorChatbot;

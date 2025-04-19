"use client";
import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef } from "react";
import ReactMarkdown from "react-markdown"
interface ProgressItem {
  skill: string;
  progress: number;
}

interface ChatbotProps {
  userId: string;
  progressData: ProgressItem[];
}

const Chatbot = ({ userId, progressData }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome back to LearnEra!" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBotReply("init", true); // initial motivational message on open
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    await fetchBotReply(userMessage);
  };

  const fetchBotReply = async (userMessage: string, isInitial = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/dashboard/${userId}/api/botResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          progressData,
          isInitial,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error("Bot response failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Bot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Hmm, something went wrong. Try again later." },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {isOpen && (
        <div className="w-[75vw] bg-[#1e1e1e] text-gray-100 m-4 p-3 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-2 border-[#2c2c2c]">
            <span className="text-lg font-semibold">🎓 LearnEra Coach</span>
            <X
              className="cursor-pointer text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="h-[50vh] overflow-y-auto mb-2 px-2 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "bot"
                    ? "bg-[#2a2a2a] text-left self-start"
                    : "bg-blue-600 text-right self-end"
                }`}
              >
                <ReactMarkdown>
                  
                  {msg.text}
                </ReactMarkdown>
                
              </div>
            ))}
            {isLoading && (
              <div className="text-sm text-gray-400 italic">Typing...</div>
            )}
            {/* Anchor for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="p-2 flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && input.trim()) {
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
            />
            <Button
              className="px-2 text-sm bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSend}
              disabled={isLoading}
            >
              📩
            </Button>
          </div>
        </div>
      )}

      <motion.button
        className="rounded-full p-3 bg-blue-600 shadow-lg hover:bg-blue-500 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? {} : { y: [0, -5, 0] }}  // Bouncy effect only when closed
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-label="Toggle chatbot"
      >
        <MessageSquare size={24} className="text-white" />
      </motion.button>
    </div>
  );
};

export default Chatbot;

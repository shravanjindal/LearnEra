"use client";
import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef } from "react";
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
    <motion.div className="fixed bottom-4 right-4 flex flex-col items-end" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
      {isOpen && (
        <div className="w-[50vw] bg-gray-800 text-gray-100 m-4 p-3 rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span className="text-lg font-semibold">🎓 LearnEra Coach</span>
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div className="h-[50vh] overflow-y-auto mb-2 px-2 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "bot"
                    ? "bg-gray-700 text-left self-start"
                    : "bg-blue-600 text-right self-end"
                }`}
              >
                {msg.text}
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
              className="p-2 flex-1 bg-gray-900 border border-gray-700 rounded text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && input.trim()) {
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
            />
            <Button className="px-2 text-sm" onClick={handleSend} disabled={isLoading}>
              📩
            </Button>
          </div>
        </div>
      )}

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

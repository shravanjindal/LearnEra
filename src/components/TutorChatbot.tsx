"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Define the type for a single message
interface Message {
  sender: "bot" | "user";
  text: string;
}

// Define the props for the component
interface TutorChatbotProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
}

const TutorChatbot: React.FC<TutorChatbotProps> = ({ messages, input, setInput, handleSend }) => {
  return (
    <motion.div
      className="w-1/4 bg-gray-800 p-5 fixed right-0 top-0 h-full flex flex-col shadow-2xl backdrop-blur-lg border-l border-gray-700"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-xl font-semibold">👨🏻‍🏫 Tutor</h2>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 border border-gray-700 rounded">
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
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded text-sm placeholder-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <Button className="p-3 flex-shrink-0" onClick={handleSend}>
          Send
        </Button>
      </div>
    </motion.div>
  );
};

export default TutorChatbot;

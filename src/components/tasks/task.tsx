"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface TaskProps {
  userId: string;
  skill: string;
  topic: string;
  description: string;
}

const Task: React.FC<TaskProps> = ({ userId, skill, topic, description }) => {
  const [taskData, setTaskData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Start Timer
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTaskContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/tasks/api/generateTask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill, topic, description }),
        });

        if (!response.ok) throw new Error("Failed to generate task content");

        const data = await response.json();
        setTaskData(data); // Assuming the task structure is returned here
      } catch (err) {
        console.error("Error fetching task content:", err);
        setError("Failed to load task. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskContent();
  }, [userId, skill, topic, description]);

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Timer at the top */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📌 {taskData?.topic || topic}</h2>
        <p className="text-lg font-semibold text-gray-300">⏳ Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
          <button
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && taskData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 bg-gray-900 rounded-lg text-gray-200"
        >
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{taskData.content}</ReactMarkdown>
        </div>
        <hr className="border-gray-700 mb-5 mt-5" />
          <h2 className="text-lg font-semibold text-gray-300">Task:</h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{taskData.task}</ReactMarkdown>
        </div>
        <hr className="border-gray-700 mb-5 mt-5" />
          <h2 className="text-lg font-semibold text-gray-300">Useful Links:</h2>
          <ul className="list-disc pl-6">
            {taskData.links && taskData.links.map((link: string, index: number) => (
              <li key={index}>
                <a href={link} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Task;

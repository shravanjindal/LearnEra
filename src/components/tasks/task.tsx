"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import mongoose from "mongoose";
import StarRatings from "react-star-ratings";

interface SelectedTask {
  topic: string;
  description: string;
}

interface TaskProps {
  userId: string;
  skill: string;
  topic: string;
  description: string;
  setSelectedTask: (task: SelectedTask | null) => void;
  setSelectedSkill: (task: string | null) => void;
}
interface TaskData {
  _id: mongoose.Schema.Types.ObjectId;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

const Task: React.FC<TaskProps> = ({ userId, skill, topic, description, setSelectedTask, setSelectedSkill }) => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
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
        setTaskData(data);
      } catch (err) {
        console.error("Error fetching task content:", err);
        setError("Failed to load task. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [userId, skill, topic, description]);

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = async () => {
    
    if (!taskData) return;

    try {
      const response = await fetch(`/tasks/${userId}/api/updateUserProgress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          skill,
          taskId: taskData._id,
          startTime: taskData.createdAt,
          endTime: Date.now(),
          feedback,
          rating,
          topic
        }),
      });

      if (!response.ok) throw new Error("Failed to update user progress");

      console.log("User progress updated successfully");
    } catch (error) {
      console.error("Error updating user progress:", error);
    }

    setShowFeedback(false);
    window.location.reload();
  };

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
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
          <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Try Again</button>
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
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-4xl font-extrabold text-blue-400 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold text-blue-300 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-medium text-blue-200 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-lg leading-relaxed text-gray-300 mb-4" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-gray-400" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="bg-gray-800 p-4 italic text-gray-200 border-l-4 border-blue-400 mb-4" {...props} />
              ),
              code: ({ node, ...props }) => (
                <pre className="bg-gray-800 text-white p-4 rounded-md mb-4 overflow-x-auto">
                  <code className="text-sm">{props.children}</code>
                </pre>
              ),
              img: ({ node, ...props }) => <img className="rounded-md mb-4" {...props} />
            }}
          >
            {taskData.content}
          </ReactMarkdown>
        </div>
        <hr className="border-gray-700 mb-5 mt-5" />
        <h2 className="text-lg font-semibold text-gray-300">Task:</h2>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{taskData.task}</ReactMarkdown>
        </div>
        <hr className="border-gray-700 mb-5 mt-5" />
        <h2 className="text-lg font-semibold text-gray-300">Useful Links:</h2>
        <ul className="list-disc pl-6">
          {taskData.links &&
            taskData.links.map((link: string, index: number) => (
              <li key={index}>
                <a
                  href={link}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              </li>
            ))}
        </ul>
        <hr className="border-gray-700 mb-5 mt-5" />
        <Button onClick={handleSubmit} className="bg-blue-900">Mark as completed</Button>
      </motion.div>
      
      )}

{showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Give Your Feedback</h2>
            
            {/* Star Rating Component */}
            <label className="block mb-2">Rating:</label>
            <StarRatings
              rating={rating}
              starRatedColor="gold"
              changeRating={(newRating) => setRating(newRating)}
              numberOfStars={5}
              name="rating"
              starDimension="30px"
              starSpacing="5px"
            />

            <label className="block mb-2 mt-4">Feedback:</label>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" rows={4}></textarea>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowFeedback(false)} className="mr-2 bg-red-600">Cancel</Button>
              <Button onClick={handleFeedbackSubmit} className="bg-green-600">Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import StarRatings from "react-star-ratings";
import { RotateCcw } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { nanoid } from 'nanoid';
import LinkCards from "./LinkCards";

interface TaskData {
  trackerId: string;
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}

interface TaskProps {
  taskData: TaskData | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate?: () => void;
}

export const renderMarkdown = (content: string) => (
  <ReactMarkdown
    components={{
      h1: (props) => <h1 className="text-4xl font-extrabold text-blue-400 mb-4 border-b border-gray-700 pb-1" {...props} />,
      h2: (props) => <h2 className="text-3xl font-bold text-blue-300 mb-3 border-b border-gray-800 pb-1" {...props} />,
      h3: (props) => <h3 className="text-2xl font-semibold text-blue-200 mb-2" {...props} />,
      p: (props) => <p className="text-base leading-relaxed text-gray-300 mb-4" {...props} />,
      ul: (props) => <ul className="list-disc pl-6 space-y-2 text-gray-300" {...props} />,
      ol: (props) => <ol className="list-decimal pl-6 space-y-2 text-gray-300" {...props} />,
      li: (props) => <li className="text-gray-300" {...props} />,
      a: (props) => <a className="text-blue-400 hover:underline hover:text-blue-300 transition-colors" {...props} />,
      blockquote: (props) => (
        <blockquote className="bg-[#1e1e1e] border-l-4 border-blue-500 p-4 italic text-gray-400 mb-4 rounded" {...props} />
      ),
      code: ({ className, children, node, ...props }) => {
        const isInline = !className;
        if (isInline) return <code className="bg-gray-800 text-blue-300 px-1 rounded font-mono">{children}</code>;
        const blockKey = node?.position?.start?.line?.toString() ?? nanoid();
        return <CodeBlock className={className} blockKey={blockKey}>{children}</CodeBlock>;
      },
      img: (props) => <img className="rounded-md mb-4 border border-gray-700" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const Task: React.FC<TaskProps> = ({ taskData, isLoading, error, onRegenerate }) => {
  const [time, setTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const renderedMarkdown = useMemo(() => taskData ? renderMarkdown(taskData.content) : null, [taskData?.content]);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!taskData) return;

    try {
      const response = await fetch(`/api/skilltrackers/${taskData.trackerId}/updateProgress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskData._id,
          startTime: taskData.createdAt,
          endTime: Date.now(),
          feedback,
          rating,
          topic: taskData.topic,
          skill: taskData.skill,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user progress");

      console.log("Progress updated.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }

    setShowFeedback(false);
    window.location.reload();
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-lg">
      <div className="lg:flex md:flex justify-between items-center mb-4">
        <div className="flex justify-end items-center mt-5">
          <h2 className="text-2xl font-bold text-gray-100 mr-5">📌 {taskData?.topic}</h2>
          <Button onClick={onRegenerate} title="Regenerate Task">
            <RotateCcw size={20} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
        <p className="text-lg font-semibold text-gray-400 mt-5">
          ⏳ Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </p>
      </div>

      {!taskData || isLoading ? (
        <div className="flex flex-col items-center justify-center text-gray-400 py-12 space-y-3">
          <RotateCcw size={28} className="animate-spin text-gray-500" />
          <div className="text-xl font-medium">Generating task...</div>
          <div className="text-sm text-gray-500">Give me a sec, cooking up something smart 🧠</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-gray-400 py-12 space-y-3">
          <div className="text-2xl">😴 Tutor fell asleep</div>
          <div className="text-sm">Try waking them up with a refresh!</div>
          <Button onClick={onRegenerate} variant="outline" className="mt-3 flex items-center gap-2">
            <RotateCcw size={16} className="text-gray-400" />
            Refresh
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 bg-[#2f2f2f] rounded-lg text-gray-300 border border-[#2c2c2c]"
        >
          {renderedMarkdown}
          <hr className="border-[#333] my-5" />
          {renderMarkdown("### Task")}
          {renderMarkdown(taskData.task)}
          <hr className="border-gray-700 my-5" />
          {renderMarkdown("### Useful Links")}
          <LinkCards links={taskData.links} />
          <hr className="border-gray-700 my-5" />
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowFeedback(true)}>
            Mark as completed
          </Button>
        </motion.div>
      )}

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] text-white w-full max-w-md p-6 rounded-lg border border-[#2c2c2c]">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">📝 Provide Feedback</h2>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Rating:</label>
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={(newRating) => setRating(newRating)}
                numberOfStars={5}
                name="rating"
                starDimension="30px"
                starSpacing="5px"
              />
            </div>
            <label className="block text-gray-300 mb-2">Your Feedback:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-md bg-[#2a2a2a] text-white border border-[#3a3a3a]"
              rows={4}
              placeholder="Share your thoughts..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowFeedback(false)}
                className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;

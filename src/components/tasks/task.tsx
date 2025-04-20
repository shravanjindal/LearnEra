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
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
}


interface TaskProps {
  userId: string;
  skill: string;
  topic: string;
  description: string;
  taskData: TaskData | null;
  setTaskData: (data: TaskData | null) => void;
}


export const renderMarkdown = (content: string) => (
  <ReactMarkdown
    components={{
      h1: ({ node, ...props }) => (
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4 border-b border-gray-700 pb-1" {...props} />
      ),
      h2: ({ node, ...props }) => (
        <h2 className="text-3xl font-bold text-blue-300 mb-3 border-b border-gray-800 pb-1" {...props} />
      ),
      h3: ({ node, ...props }) => (
        <h3 className="text-2xl font-semibold text-blue-200 mb-2" {...props} />
      ),
      p: ({ node, ...props }) => (
        <p className="text-base leading-relaxed text-gray-300 mb-4" {...props} />
      ),
      ul: ({ node, ...props }) => (
        <ul className="list-disc pl-6 space-y-2 text-gray-300" {...props} />
      ),
      ol: ({ node, ...props }) => (
        <ol className="list-decimal pl-6 space-y-2 text-gray-300" {...props} />
      ),
      li: ({ node, ...props }) => (
        <li className="text-gray-300" {...props} />
      ),
      a: ({ node, ...props }) => (
        <a className="text-blue-400 hover:underline hover:text-blue-300 transition-colors" {...props} />
      ),
      blockquote: ({ node, ...props }) => (
        <blockquote
          className="bg-[#1e1e1e] border-l-4 border-blue-500 p-4 italic text-gray-400 mb-4 rounded"
          {...props}
        />
      ),
      code: ({ className, children, node, ...props }) => {
        const isInline = !className;

        if (isInline) {
          return (
            <code className="bg-gray-800 text-blue-300 px-1 rounded font-mono">
              {children}
            </code>
          );
        }

        const blockKey = node?.position?.start?.line?.toString() ?? nanoid();

        return <CodeBlock className={className} blockKey={blockKey}>{children}</CodeBlock>;
      },
      img: ({ node, ...props }) => (
        <img className="rounded-md mb-4 border border-gray-700" {...props} />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);



const Task: React.FC<TaskProps> = ({ userId, skill, topic, description, taskData, setTaskData }) => {
  const [fetchState, setFetchState] = useState<{ loading: boolean; error: string | null }>({
    loading: true,
    error: null,
  });
  const [time, setTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const renderedMarkdown = useMemo(
    () => taskData ? renderMarkdown(taskData.content) : null, [taskData ? taskData.content : null]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTask = async () => {
    setFetchState({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/generateTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, topic, description }),
      });

      if (!response.ok) throw new Error("Failed to generate task content");

      const data = await response.json();
      setTaskData(data);
    } catch (err) {
      setFetchState({ loading: false, error: "Failed to load task. Please try again later." });
    } finally {
      setFetchState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchTask();
  }, [userId, skill, topic, description]);

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!taskData) return;

    try {
      const response = await fetch(`/api/tasks/${userId}/updateUserProgress`, {
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
          topic,
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
    <div className="mt-8 bg-[#1e1e1e] rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="lg:flex md:flex justify-between items-center mb-4">
        <div className="flex justify-end">
          <h2 className="text-2xl font-bold text-gray-100 mr-5">📌 {taskData?.topic || topic}</h2>
          <Button
            className="bg-[#2f2f2f] hover:bg-blue-700 text-white p-2 rounded transition duration-300"
            onClick={fetchTask}
            title="Regenerate Task"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
        <p className="text-lg font-semibold text-gray-400">
          ⏳ Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </p>
      </div>

      {fetchState.loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      )}

      {fetchState.error && (
        <div className="bg-red-950 border border-red-600 rounded-lg p-4 mb-6">
          <p className="text-red-300">{fetchState.error}</p>
          <button
            className="mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition duration-300"
            onClick={fetchTask}
          >
            Try Again
          </button>
        </div>
      )}

      {!fetchState.loading && !fetchState.error && taskData && (
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
          {renderMarkdown("### Useful Links ")}

          <LinkCards links={taskData.links}/>

          <hr className="border-gray-700 my-5" />

          <Button className="bg-blue-600 hover:bg-blue-700 transition duration-300" onClick={handleSubmit}>
            Mark as completed
          </Button>
        </ motion.div>
      )}





      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] text-white w-full max-w-md p-6 rounded-lg border border-[#2c2c2c]">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">📝 Provide Feedback</h2>

            {/* Star Rating Component */}
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

            {/* Feedback Textarea */}
            <label className="block text-gray-300 mb-2">Your Feedback:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
              rows={4}
              placeholder="Share your thoughts..."
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
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

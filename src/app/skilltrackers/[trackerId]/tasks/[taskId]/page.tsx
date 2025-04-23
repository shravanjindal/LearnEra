"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import StarRatings from "react-star-ratings";
import { RotateCcw } from "lucide-react";
import CodeBlock from "@/components/tasks/CodeBlock";
import { nanoid } from 'nanoid';
import LinkCards from "@/components/tasks/LinkCards";
import { useParams } from "next/navigation";

interface TaskData {
  trackerId: string;
  _id: string;
  skill: string;
  topic: string;
  content: string;
  task: string;
  links: string[];
  createdAt: Date;
  feedback: string;
  rating: number;
  startTime: string;
  endTime: string;
}

interface TaskProps {
  trackerId: string;
  taskId: string;
}

const renderMarkdown = (content: string) => (
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

const Task: React.FC<TaskProps> = () => {
  const { trackerId,taskId } = useParams();

  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderedMarkdown = useMemo(() => taskData ? renderMarkdown(taskData.content) : null, [taskData?.content]);

  // Function to calculate elapsed time in minutes
  const calculateTimeElapsed = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const elapsed = end - start; // Time difference in milliseconds
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Fetch task and feedback data on component mount
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const taskResponse = await fetch(`/api/tasks/${taskId}`);
        const task = await taskResponse.json();

        const trackerResponse = await fetch(`/api/skilltrackers/${trackerId}`);
        const tracker = await trackerResponse.json();

        // Find the task in the tasksDone array
        const taskFeedback = tracker.tasksDone.find((t: any) => t.taskId._id === taskId);

        if (!taskResponse.ok || !trackerResponse.ok) {
          throw new Error("Failed to fetch task or tracker data");
        }

        if (taskFeedback) {
          setTaskData({
            ...task,
            feedback: taskFeedback.feedback,
            rating: taskFeedback.rating,
            startTime: taskFeedback.startTime,
            endTime: taskFeedback.endTime,
          });
        }

        setIsLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [trackerId, taskId]);

  return (
    <div className="bg-black">
  <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-xl">
    <div className="lg:flex md:flex justify-between items-center mb-6">
      <div className="flex justify-end items-center mt-4">
        <h2 className="text-3xl font-semibold text-gray-100 mr-6">📌 {taskData?.topic}</h2>
      </div>
      <p className="text-lg font-medium text-gray-400 mt-3">
        ⏳ Time Taken: {taskData ? calculateTimeElapsed(taskData.startTime, taskData.endTime) : "Loading..."}
      </p>
    </div>

    {!taskData || isLoading ? (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-gray-400 py-12 space-y-4">
    <RotateCcw size={28} className="animate-spin text-gray-500" />
    <div className="text-xl font-semibold">Fetching task...</div>
    <div className="text-sm text-gray-500">Hang tight, I'm getting this ready for you 🧠</div>
  </div>
) : error ? (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-gray-400 py-12 space-y-4">
    <div className="text-2xl">😴 Oops, something went wrong!</div>
    <div className="text-sm">Try refreshing to wake up the tutor!</div>
    <Button
      onClick={() => window.location.reload()}
      variant="outline"
      className="mt-3 flex items-center gap-2 px-5 py-2 border-2 border-gray-400 rounded-lg text-gray-400 hover:text-gray-600 transition"
    >
      <RotateCcw size={16} className="text-gray-400" />
      Refresh
    </Button>
  </div>
) : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-[#2f2f2f] rounded-lg text-gray-300 border border-[#333] shadow-lg"
      >
        {renderedMarkdown}
        <hr className="border-[#444] my-6" />
        {renderMarkdown("### Task")}
        {renderMarkdown(taskData.task)}
        <hr className="border-[#444] my-6" />
        {renderMarkdown("### Useful Links")}
        <LinkCards links={taskData.links} />
        <hr className="border-[#444] my-6" />
        {/* Display feedback and rating as read-only */}
        <div className="mt-6">
          <h3 className="text-2xl text-gray-200 mb-4">📝 Your Feedback</h3>
          <p className="text-gray-300 italic mb-4">"{taskData.feedback || 'No feedback provided.'}"</p>
          <StarRatings
            rating={taskData.rating}
            starRatedColor="gold"
            numberOfStars={5}
            name="rating"
            starDimension="28px"
            starSpacing="4px"
          />
        </div>
      </motion.div>
    )}
  </div>
</div>

  );
};

export default Task;

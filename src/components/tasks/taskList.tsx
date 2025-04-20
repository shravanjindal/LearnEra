"use client"
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface Topic {
  topic: string;
  description: string;
  prerequisites?: string[];
}

interface TaskListProps {
  skill: string;
  onGoBack: () => void;
  userId: string;
  onStartTask: (task: { topic: string; description: string }) => void; // New prop
}

const TaskList = ({ skill, onGoBack, userId, onStartTask }: TaskListProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [skill, userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await fetch(`/api/users/${userId}`);
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      const skillTracker = userData.skillTracker.find((tracker: any) => tracker.skill.toLowerCase() === skill.toLowerCase());
      if (!skillTracker) throw new Error("Skill tracker not found");

      const skillTrackerResponse = await fetch(`/api/skilltrackers/${skillTracker._id}`);
      if (!skillTrackerResponse.ok) throw new Error("Failed to fetch skill tracker");

      const skillTrackerData = await skillTrackerResponse.json();

      // Get the last 5 tasksDone, sorted by most recent endTime
      const last5TasksDone = skillTrackerData.tasksDone
        .sort((a: any, b: any) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
        .slice(0, 5)
        .map((element: any) => ({
          feedback: element.feedback || "no user feedback",
          rating: element.rating || "no rating",
          taskDone: element.taskId?.task ?? "Task not found",
          topic: element.topic,
        }));

      // console.log(userSkillProgress);
      fetchTopics(last5TasksDone, userData.purpose);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again later.");
      setLoading(false);
    }
  };

  const fetchTopics = async (tasksDone: string[], purpose: string[]) => {
    try {
      const response = await fetch(`/api/tasks/getTopics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: { skill: skill.toLowerCase(), tasksDone, purpose },
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch topics");
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Button className="bg-gray-700 text-white px-4 py-2 flex items-center gap-2" onClick={onGoBack}>
          <ArrowLeft size={18} /> Go Back
        </Button>
        <h2 className="text-2xl font-bold">🎯 Available Tasks for {skill}</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
          <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white" onClick={fetchUserData}>
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && topics.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">No tasks available for this skill yet.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={fetchUserData}>
            Refresh Tasks
          </Button>
        </div>
      )}

      {!loading && !error && topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              className="p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 flex flex-col min-h-[250px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-semibold">{topic.topic}</h3>
              <p className="text-gray-400 flex-grow">{topic.description}</p>

              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <div className="mt-auto mb-3">
                  <h4 className="text-sm font-medium text-gray-300">Prerequisites:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-400">
                    {topic.prerequisites.map((prereq, i) => (
                      <li key={i}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="mt-auto bg-black w-full text-white" onClick={() => onStartTask({ topic: topic.topic, description: topic.description })}>
                Start Now
              </Button>          
            </motion.div>
          ))}
        </div>

      )}
    </div>
  );
};

export default TaskList;

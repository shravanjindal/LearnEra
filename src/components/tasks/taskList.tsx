"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface Topic {
  skill: string;
  topic: string;
  description: string;
  prerequisites?: string[];
}

interface TaskListProps {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onGoBack: () => void;
  onStartTask: (task: { skill:string; topic: string; description: string }) => void;
}

const TaskList = ({ topics, loading, error, onRetry,onGoBack, onStartTask }: TaskListProps) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Button className="bg-gray-700 text-white px-4 py-2 flex items-center gap-2" onClick={onGoBack}>
          <ArrowLeft size={18} /> Go Back
        </Button>
        <h2 className="text-2xl font-bold">🎯 Available Topics</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
          <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && topics.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">No topics available yet.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onRetry}>
            Refresh Topics
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

              <Button
                className="mt-auto bg-black w-full text-white"
                onClick={() => onStartTask({ skill: topic.skill, topic: topic.topic, description: topic.description })}
              >
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

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type Task = {
  level: string;
  description: string;
};

const TaskList = ({ skill, tasks, onGoBack }: { skill: string; tasks: Task[]; onGoBack: () => void }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Button className="bg-gray-700 text-white px-4 py-2 flex items-center gap-2" onClick={onGoBack}>
          <ArrowLeft size={18} /> Go Back
        </Button>
        <h2 className="text-2xl font-bold">🎯 Available Tasks for {skill}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            className="p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-semibold">{task.level}</h3>
            <p className="text-gray-400">{task.description}</p>
            <Button className="mt-3 bg-black w-full text-white">Start Now</Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

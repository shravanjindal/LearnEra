import React from "react";
import { Trash2 } from "lucide-react"; // using lucide-react for icons

interface GoalDialogBoxProps {
  user: {
    name: string;
    purpose: string[];
  };
  goal: string;
  setGoal: (value: string) => void;
  handleDeleteGoal: (index: number) => void; // updated to delete specific goals
  handleUpdateGoal: () => void;
  setGoalDialogBoxOpen: (open: boolean) => void;
}

const GoalDialogBox: React.FC<GoalDialogBoxProps> = ({
  user,
  goal,
  setGoal,
  handleDeleteGoal,
  handleUpdateGoal,
  setGoalDialogBoxOpen,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md p-6 rounded-lg border border-[#2c2c2c]">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">🎯 Set Your Learning Goals</h2>
        <p className="text-sm text-gray-300 mb-2 leading-relaxed">
          <span className="text-white font-medium">Tutor:</span> Hi{" "}
          <span className="font-semibold text-blue-300">{user.name}</span>!<br />
          Here are your current goals:
        </p>

        <ul className="list-disc pl-5 mb-4 space-y-2">
          {user.purpose.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-blue-200">
              <span>{item}</span>
              <button
                onClick={() => handleDeleteGoal(index)}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="e.g., Build real-world projects"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
          required
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleUpdateGoal}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setGoalDialogBoxOpen(false)}
            className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalDialogBox;

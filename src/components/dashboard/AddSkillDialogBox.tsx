import React from "react";

interface AddSkillDialogBoxProps {
  skill: string;
  setSkill: (value: string) => void;
  handleAddSkill: () => void;
  setSkillDialogBoxOpen: (open: boolean) => void;
}

const AddSkillDialogBox: React.FC<AddSkillDialogBoxProps> = ({
  skill,
  setSkill,
  handleAddSkill,
  setSkillDialogBoxOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-96 max-w-md border border-[#2c2c2c]">
        <h2 className="text-xl font-semibold text-white mb-4">Add Skill</h2>

        <input
          type="text"
          placeholder="Enter a skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleAddSkill}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Add
          </button>
          <button
            onClick={() => setSkillDialogBoxOpen(false)}
            className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillDialogBox;

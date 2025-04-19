import React from "react";

interface DeleteSkillDialogBoxProps {
  skill: string;
  handleDeleteSkill: () => void;
  setDeleteDialogBoxOpen: (open: boolean) => void;
}

const DeleteSkillDialogBox: React.FC<DeleteSkillDialogBoxProps> = ({
  skill,
  handleDeleteSkill,
  setDeleteDialogBoxOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-96 max-w-md border border-[#2c2c2c]">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Skill</h2>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to delete the skill:{" "}
          <span className="font-semibold text-white">{skill}</span>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDeleteSkill}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialogBoxOpen(false)}
            className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSkillDialogBox;

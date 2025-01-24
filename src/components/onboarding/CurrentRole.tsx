import React from 'react';

type CurrentRoleProps = {
  formData: {
    currentRole: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentRoleOptions: string[];
};

const CurrentRole = ({ formData, handleChange, currentRoleOptions }: CurrentRoleProps) => {
  return (
    <div className="space-y-4">
      {currentRoleOptions.map((role) => (
        <label key={role} className="flex items-center space-x-2">
          <input
            type="radio"
            name="currentRole"
            value={role}
            checked={formData.currentRole === role}
            onChange={handleChange}
            className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-600"
            required
          />
          <span className="text-gray-700">{role}</span>
        </label>
      ))}
    </div>
  );
};

export default CurrentRole;
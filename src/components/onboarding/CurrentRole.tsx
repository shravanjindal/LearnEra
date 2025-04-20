import React from 'react';
import { FormData } from '@/utils/utils';

type CurrentRoleProps = {
  formData: FormData;
  setFormData: (input: FormData) => void;  // Setter function
  currentRoleOptions: string[];
};

const CurrentRole = ({
  formData,
  setFormData,
  currentRoleOptions,
}: CurrentRoleProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Who are you?</h1>
      {currentRoleOptions.map((role) => (
        <label key={role} className="flex items-center space-x-2">
          <input
            type="radio"
            name="currentRole"
            value={role}
            checked={
              formData.currentRole === role ||
              (role === "Other" && !currentRoleOptions.includes(formData.currentRole))
            }
            onChange={(e) => {
              if (e.target.value === "Other") {
                // Keep all other form data intact, but reset currentRole
                setFormData({ ...formData, currentRole: "" });
              } else {
                // Update currentRole and keep other fields intact
                setFormData({ ...formData, currentRole: e.target.value });
              }
            }}
            className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-600"
            required
          />
          <span className="text-gray-700">{role}</span>
        </label>
      ))}

      {/* If "Other" is selected, show input box */}
      {!currentRoleOptions.includes(formData.currentRole) && (
        <input
          type="text"
          name="customRole"
          placeholder="Please specify"
          value={formData.currentRole}
          onChange={(e) =>
            setFormData({ ...formData, currentRole: e.target.value }) // Update only currentRole
          }
          className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      )}
    </div>
  );
};

export default CurrentRole;

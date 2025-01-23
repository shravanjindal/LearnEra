import React from 'react';

type PurposeProps = {
  formData: {
    purpose: string[];
  };
  handlePurposeChange: (purpose: string) => void;
  purposeOptions: string[];
};

const Purpose = ({ formData, handlePurposeChange, purposeOptions }: PurposeProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">What Is Your Purpose of Using This Application?</h2>
      <div className="space-y-4">
        {purposeOptions.map((purpose) => (
          <label key={purpose} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="purpose"
              value={purpose}
              checked={formData.purpose.includes(purpose)}
              onChange={() => handlePurposeChange(purpose)}
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-600"
            />
            <span className="text-gray-700">{purpose}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Purpose;
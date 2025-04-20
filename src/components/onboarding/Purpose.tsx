import React, { useState } from 'react';
import { FormData } from '@/utils/utils';

type PurposeProps = {
  formData: FormData;
  handlePurposeChange: (purpose: string) => void;
  setFormData: (input: FormData) => void;
  purposeOptions: string[];
};

const Purpose = ({
  formData,
  handlePurposeChange,
  setFormData,
  purposeOptions,
}: PurposeProps) => {
  const [customPurpose, setCustomPurpose] = useState('');

  const handleAddCustomPurpose = () => {
    const trimmed = customPurpose.trim();
    if (trimmed && !formData.purpose.includes(trimmed)) {
      setFormData({
        ...formData,
        purpose: [...formData.purpose, trimmed],
      });
    }
    setCustomPurpose('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomPurpose();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        What Is Your Purpose of Using This Application?
      </h2>

      <div className="space-y-4">
        {purposeOptions.length > 0 ? (
          purposeOptions.map((purpose) => (
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
          ))
        ) : (
          <>
            <input
              type="text"
              name="customPurpose"
              placeholder="Eg. Get internships/jobs, Learn new skills, etc."
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="button"
              onClick={handleAddCustomPurpose}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Purpose
            </button>
          </>
        )}
      </div>

      {/* Show selected purposes */}
      {formData.purpose.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Selected Purposes: {formData.purpose.join(', ')}
        </div>
      )}
    </div>
  );
};

export default Purpose;

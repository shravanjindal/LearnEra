import React, { useState } from 'react';
import { FormData } from '@/app/onboarding/utils';

type SkillsProps = {
  formData: FormData;
  handleSkillChange: (skill: string) => void;
  setFormData: (input: FormData) => void;
  skillsOptions: { [key: string]: string[] | null };
};

const Skills = ({
  formData,
  handleSkillChange,
  setFormData,
  skillsOptions,
}: SkillsProps) => {
  const [customSkillInputs, setCustomSkillInputs] = useState<{ [key: string]: string }>({});

  const handleAddCustomSkill = (key: string) => {
    const input = customSkillInputs[key]?.trim();
    if (input && !formData.skills.includes(input)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, input],
      });
    }
    setCustomSkillInputs((prev) => ({ ...prev, [key]: '' }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, key: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill(key);
    }
  };

  const hasValidSkills = formData.purpose.some(
    (purpose) => skillsOptions[purpose] && skillsOptions[purpose]!.length > 0
  );

  return (
    <div>
      <div className="space-y-6">
        {hasValidSkills ? (
          formData.purpose.map((purpose) => {
            const options = skillsOptions[purpose];
            if (!options || options.length === 0) return null;

            return (
              <div key={purpose}>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{purpose}</h3>

                <div className="space-y-2 mb-2">
                  {options.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-600"
                      />
                      <span className="text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>

                {/* Custom input under each valid purpose */}
                <input
                  type="text"
                  placeholder="Add custom skill"
                  value={customSkillInputs[purpose] || ''}
                  onChange={(e) =>
                    setCustomSkillInputs((prev) => ({ ...prev, [purpose]: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, purpose)}
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                  type="button"
                  onClick={() => handleAddCustomSkill(purpose)}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Skill
                </button>
              </div>
            );
          })
        ) : (
          // Only one box when all are empty
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Skills You Want to Learn</h3>
            <input
              type="text"
              placeholder="Eg. Web development, DSA, etc."
              value={customSkillInputs['general'] || ''}
              onChange={(e) =>
                setCustomSkillInputs((prev) => ({ ...prev, general: e.target.value }))
              }
              onKeyDown={(e) => handleKeyDown(e, 'general')}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="button"
              onClick={() => handleAddCustomSkill('general')}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Skill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;

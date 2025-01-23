import React from 'react';

type SkillsProps = {
  formData: {
    purpose: string[];
    skills: string[];
  };
  handleSkillChange: (skill: string) => void;
  skillsOptions: { [key: string]: string[] };
};

const Skills = ({ formData, handleSkillChange, skillsOptions }: SkillsProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">What Skills Do You Want to Pursue?</h2>
      <div className="space-y-4">
        {formData.purpose.map((purpose) => (
          <div key={purpose}>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{purpose}</h3>
            {skillsOptions[purpose]?.map((skill) => (
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
        ))}
      </div>
    </div>
  );
};

export default Skills;
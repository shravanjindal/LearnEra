"use client";
import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Signup from '@/components/onboarding/Signup';
import CurrentRole from '@/components/onboarding/CurrentRole';
import Purpose from '@/components/onboarding/Purpose';
import Skills from '@/components/onboarding/Skills';
import { useRouter } from 'next/navigation';

type CurrentRole = 'BTech Student' | 'PhD Student' | 'Working Professional';

type FormData = {
  name: string;
  email: string;
  password: string;
  currentRole: string;
  purpose: string[];
  skills: string[];
};

const OnboardingPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    currentRole: '',
    purpose: [],
    skills: [],
  });

  const currentRoleOptions: CurrentRole[] = ['BTech Student', 'PhD Student', 'Working Professional'];

  const purposeOptions = {
    'BTech Student': ['Learn new skills in tech', 'Prepare for internships/jobs', 'Build projects'],
    'PhD Student': ['Research assistant', 'Learn advanced topics', 'Publish papers'],
    'Working Professional': ['Career growth', 'Upskill in tech', 'Switch domains'],
  };

  const skillsOptions = {
    'Learn new skills in tech': ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing'],
    'Prepare for internships/jobs': ['Coding Interviews', 'Resume Building', 'Networking'],
    'Build projects': ['Full-Stack Development', 'Mobile App Development', 'IoT Projects'],
    'Research assistant': ['AI/ML Research', 'Data Analysis', 'Scientific Computing'],
    'Learn advanced topics': ['Deep Learning', 'Blockchain', 'Quantum Computing'],
    'Publish papers': ['Academic Writing', 'Research Methodology', 'Data Visualization'],
    'Career growth': ['Leadership Skills', 'Technical Certifications', 'Mentorship'],
    'Upskill in tech': ['DevOps', 'Cybersecurity', 'Big Data'],
    'Switch domains': ['From Non-Tech to Tech', 'From Hardware to Software', 'From Testing to Development'],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurposeChange = (purpose: string) => {
    setFormData((prev) => {
      const updatedPurpose = prev.purpose.includes(purpose)
        ? prev.purpose.filter((p) => p !== purpose)
        : [...prev.purpose, purpose];
      return { ...prev, purpose: updatedPurpose };
    });
  };

  const handleSkillChange = (skill: string) => {
    setFormData((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
          alert("Please fill in all fields: Name, Email, and Password.");
          return false;
        }
        return true;
      case 2:
        if (!formData.currentRole) {
          alert("Please select your current role.");
          return false;
        }
        return true;
      case 3:
        if (formData.purpose.length === 0) {
          alert("Please select at least one purpose.");
          return false;
        }
        return true;
      case 4:
        if (formData.skills.length === 0) {
          alert("Please select at least one skill.");
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 4) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form Data:', formData);
      alert('Onboarding complete!');
      router.push("/dashboard/khwcbd")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Onboarding</h1>
        <div className="flex justify-center space-x-4 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Signup formData={formData} handleChange={handleChange} />
          )}
          {step === 2 && (
            <CurrentRole
              formData={formData}
              handleChange={handleChange}
              currentRoleOptions={currentRoleOptions}
            />
          )}
          {step === 3 && (
            <Purpose
              formData={formData}
              handlePurposeChange={handlePurposeChange}
              purposeOptions={purposeOptions[formData.currentRole as CurrentRole] || []}
            />
          )}
          {step === 4 && (
            <Skills
              formData={formData}
              handleSkillChange={handleSkillChange}
              skillsOptions={skillsOptions}
            />
          )}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
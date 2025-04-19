"use client";
import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Signup from '@/components/onboarding/Signup';
import CurrentRole from '@/components/onboarding/CurrentRole';
import Purpose from '@/components/onboarding/Purpose';
import Skills from '@/components/onboarding/Skills';
import { useRouter } from 'next/navigation';
import {
  currentRoleOptions,
  purposeOptions,
  skillsOptions,
  handleChange,
  handlePurposeChange,
  handleSkillChange,
  validateStep,
  leftSectionContent,
} from './utils';
import { FormData } from './utils'; // Assuming you have a types file for shared types

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
    badges: ["newbie"],
  });
  const [buttonText, setButtonText] = useState<String>("Submit");
  const nextStep = () => {
    if (validateStep(step, formData)) {
      if (step < 4) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step, formData)) {
      try {
        setButtonText("Process Initiated!")
        // Send a POST request to the backend API
        const response = await fetch('/onboarding/api/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Correct headers syntax
          },
          body: JSON.stringify(formData), // Send the form data as JSON
        });
      
        // Check if the request was successful
        if (response.ok) {
          const data = await response.json(); // Parse the JSON response
          console.log('User created successfully:', data.user);
      
          if (data.user && data.user._id) {
            alert(`Onboarding complete! ${data.message}`);
            router.push(`/dashboard/${data.user._id}`); // Redirect to the dashboard with user ID
          } else {
            setButtonText("Submit");

            console.error('User ID missing in response');
            alert('User created, but no ID received.');
          }
        } else {
          // Handle errors from the server
          const errorData = await response.json();
          setButtonText("Submit");
          alert(`Failed to create user: ${errorData.message}`);
          // alert('Failed to save user data. Please try again.');
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
        setButtonText("Submit");
      }
      
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl flex">
        {/* Left Section - Dynamic Content */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-8 w-1/2">
          <h2 className="text-3xl font-bold mb-4">{leftSectionContent(step).title}</h2>
          <p className="text-lg text-center mb-6">{leftSectionContent(step).description}</p>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step === s ? 'border-white bg-purple-800' : 'border-purple-300'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="p-8 w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Onboarding</h1>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Signup formData={formData} handleChange={(e) => handleChange(setFormData, e)} />
            )}
            {step === 2 && (
              <CurrentRole
                formData={formData}
                handleChange={(e) => handleChange(setFormData, e)}
                currentRoleOptions={currentRoleOptions}
              />
            )}
            {step === 3 && (
              <Purpose
                formData={formData}
                handlePurposeChange={(purpose) => handlePurposeChange(setFormData, purpose)}
                purposeOptions={purposeOptions[formData.currentRole as keyof typeof purposeOptions] || []}
              />
            )}
            {step === 4 && (
              <Skills
                formData={formData}
                handleSkillChange={(skill) => handleSkillChange(setFormData, skill)}
                skillsOptions={skillsOptions}
              />
            )}
            <div className="flex justify-between mt-6">
              {step == 1 && (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <p>Already have an account ?</p>
                </button>
              )}
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
                  {buttonText}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
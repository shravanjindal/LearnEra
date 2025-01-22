import React from 'react';
import WorkingCard from './WorkingCard';
import { FaUserCheck, FaTasks, FaClipboardCheck } from 'react-icons/fa'; // Import relevant icons

const Working = () => {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6 flex flex-col justify-center"
    >
      <div className="container mx-auto text-center">
        {/* Title */}
        <h3
          className="text-5xl font-extrabold tracking-wide mb-3"
        
        >
          How It Works
        </h3>

        {/* Subtitle */}
        <p
          className="text-xl text-blue-200 tracking-wide mb-12"
          
        >
          A simple three-step process to help you achieve your learning goals.
        </p>

        {/* Cards */}
        <div
          className="flex flex-wrap justify-center gap-12"
      
        >
          {/* Card 1: Onboarding */}
          <div
            
          >
            <WorkingCard
              stepNumber={1}
              title="Onboarding"
              description="Answer a few questions to help us understand your interests, goals, and skills."
              icon={<FaUserCheck className="text-3xl" />} // Icon for onboarding
            />
          </div>

          {/* Card 2: Doing Task */}
          <div
         
          >
            <WorkingCard
              stepNumber={2}
              title="Daily Tasks"
              description="Complete daily tasks tailored to your goals to enhance your learning experience."
              icon={<FaTasks className="text-3xl" />} // Icon for tasks
            />
          </div>

          {/* Card 3: Assessment */}
          <div
           
          >
            <WorkingCard
              stepNumber={3}
              title="Assessment"
              description="Take assessments to track your progress and receive personalized learning recommendations."
              icon={<FaClipboardCheck className="text-3xl" />} // Icon for assessment
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
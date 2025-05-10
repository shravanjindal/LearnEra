import React from 'react'
import WorkingCard from './cards/WorkingCard'
import { UserCheck, ListTodo, ClipboardCheck } from 'lucide-react'

const Working = () => {
  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6 flex flex-col justify-center overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Title */}
        <h3 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
          How It Works
        </h3>

        {/* Subtitle */}
        <p className="text-xl text-slate-300 tracking-wide mb-12 max-w-2xl mx-auto">
          A simple three-step process to help you achieve your learning goals.
        </p>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {/* Card 1: Onboarding */}
          <div>
            <WorkingCard
              stepNumber={1}
              title="Onboarding"
              description="Answer a few questions to help us understand your interests, goals, and skills."
              icon={<UserCheck className="w-8 h-8" />}
            />
          </div>

          {/* Card 2: Doing Task */}
          <div>
            <WorkingCard
              stepNumber={2}
              title="Daily Tasks"
              description="Complete daily tasks tailored to your goals to enhance your learning experience."
              icon={<ListTodo className="w-8 h-8" />}
            />
          </div>

          {/* Card 3: Assessment */}
          <div>
            <WorkingCard
              stepNumber={3}
              title="Assessment"
              description="Take assessments to track your progress and receive personalized learning recommendations."
              icon={<ClipboardCheck className="w-8 h-8" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Working

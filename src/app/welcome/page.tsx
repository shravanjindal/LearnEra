"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Briefcase, User, BookOpen, FlaskConical, Stethoscope,
    Palette, DollarSign, Globe, ShieldCheck, Search, PenLine, UserPlus,
    Star, Brain, Users, Laptop, Code2, PieChart, Settings, Rocket,
    Film, School, ScrollText, Milestone, MoreHorizontal, Sparkles
} from "lucide-react";

// ICON MAP
const roleIconMap: Record<string, React.ReactNode> = {
    "Secondary School Student": <School />,
    "High Secondary School Student": <School />,
    "College Student (Tech)": <Laptop />,
    "College Student (Non-Tech)": <BookOpen />,
    // "Undergraduate Student (Medical)": <Stethoscope />,
    // "Postgraduate Student": <GraduationCap />,
    // "PhD Scholar": <FlaskConical />,
    // "Researcher": <Brain />,
    "Working Professional (Tech)": <Code2 />,
    "Working Professional (Non-Tech)": <Briefcase />,
    "Entrepreneur": <Rocket />,
    "Freelancer": <UserPlus />,
    "School Teacher": <School />,
    // "College Professor": <ScrollText />,
    "Mentor": <Star />,
    "Job Seeker": <Search />,
    // "Startup Founder": <Milestone />,
    "Product Manager": <Settings />,
    // "UI/UX Designer": <Palette />,
    // "Data Analyst": <PieChart />,
    // "Machine Learning Engineer": <Brain />,
    // "Doctor": <Stethoscope />,
    // "Nurse": <ShieldCheck />,
    // "Pharmacist": <FlaskConical />,
    // "Law Student": <ScrollText />,
    // "Civil Services Aspirant": <ShieldCheck />,
    // "CA/CS Student": <DollarSign />,
    // "Finance Professional": <DollarSign />,
    // "Investor": <DollarSign />,
    // "Artist": <Palette />,
    // "Content Creator": <Film />,
    // "Journalist": <PenLine />,
    // "NGO Volunteer": <Globe />,
    // "Community Manager": <Users />,
    "Other": <MoreHorizontal />,
};

// SKILL MAP
const roleSkillsMap: Record<string, string[]> = {
    "Secondary School Student": ["Basic Math", "Science Projects", "Creative Writing"],
    "High Secondary School Student": ["Physics", "Coding Basics", "Communication Skills"],
    "College Student (Tech)": ["DSA", "Machine Learning", "Web Dev", "GitHub"],
    "College Student (Non-Tech)": ["Anatomy", "Clinical Skills", "Bioinformatics"],
    "Working Professional (Tech)": ["System Design", "Cloud", "DevOps"],
    "Working Professional (Non-Tech)": ["Leadership", "Excel", "Public Speaking"],
    "Entrepreneur": ["Startup Pitching", "Fundraising", "Marketing"],
    "Freelancer": ["Client Handling", "Portfolio Building", "Online Platforms"],
    "School Teacher": ["Child Psychology", "Digital Classrooms", "Creative Teaching"],
    "Mentor": ["Coaching", "Listening Skills", "Feedback Giving"],
    "Job Seeker": ["Resume Building", "Interview Prep", "LinkedIn Optimization"],
    "Product Manager": ["Product Lifecycle", "Jira", "Agile Methods"],
    "Other": []
};

// Add "Write your own skill" to each role
Object.keys(roleSkillsMap).forEach((role) => {
    roleSkillsMap[role].push("Write your own skill");
});

const WhoAreYou = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [customSkill, setCustomSkill] = useState<string>("");

    const router = useRouter();

    const handleSubmit = () => {
        const skillToSend = selectedSkill === "Write your own skill" ? customSkill : selectedSkill;
        if (selectedRole && skillToSend) {
            router.push(`/onboarding?role=${encodeURIComponent(selectedRole)}&skill=${encodeURIComponent(skillToSend)}`);
        }
    };

    return (
        <motion.section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6 min-h-screen flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-6 text-center">
                {selectedRole ? "What do you want to learn?" : "Who Are You?"}
            </h2>

            {/* Role Selection */}
            <AnimatePresence>
                {!selectedRole && (
                    <motion.div
                    key="roles"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    >
                    {Object.entries(roleIconMap).map(([role, icon]) => (
                        <div
                        key={role}
                        className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center shadow-lg shadow-slate-900/30 hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-3 hover:scale-105"
                        onClick={() => setSelectedRole(role)}
                        >
                        <div className="h-16 w-16 flex items-center justify-center bg-slate-700/50 text-cyan-400 rounded-full shadow-inner text-3xl">
                            {icon}
                        </div>
                        <div className="text-base md:text-lg font-semibold text-white">
                            {role}
                        </div>
                        </div>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>


            {/* Skill Selection */}
            <AnimatePresence>
  {selectedRole && (
    <motion.div
      key="skills"
      className="w-full max-w-5xl flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Skill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-2">
        {roleSkillsMap[selectedRole].map((skill) => (
          <motion.div
            key={skill}
            onClick={() => {
              setSelectedSkill(skill);
              if (skill !== "Write your own skill") setCustomSkill("");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer flex flex-col items-center justify-center px-6 py-5 rounded-2xl transition-all duration-200 border-2 h-36 text-center shadow-lg ${
              selectedSkill === skill
                ? "bg-gradient-to-br from-green-400 to-emerald-500 text-black border-green-300 shadow-green-400/30"
                : "bg-slate-800/50 text-cyan-300 border-slate-600 hover:shadow-cyan-500/10 backdrop-blur-md"
            }`}
          >
            <Sparkles className="w-8 h-8 mb-3" />
            <span className="font-medium text-base sm:text-lg">{skill}</span>
          </motion.div>
        ))}
      </div>

      {/* Custom Skill Input */}
      {selectedSkill === "Write your own skill" && (
        <div className="mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter your custom skill..."
            className="w-full p-3 rounded-lg bg-slate-800/60 text-white border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button
          type="button"
          className="px-6 py-3 bg-slate-700/50 text-cyan-300 font-semibold rounded-lg border border-slate-600 hover:bg-slate-600/70 transition"
          onClick={() => {
            setSelectedRole(null);
            setSelectedSkill(null);
            setCustomSkill("");
          }}
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={
            !selectedSkill ||
            (selectedSkill === "Write your own skill" && customSkill.trim() === "")
          }
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-md hover:brightness-110 transition disabled:opacity-50"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </motion.section>
    );
};

export default WhoAreYou;

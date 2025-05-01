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
    "Undergraduate Student (Tech)": ["DSA", "Machine Learning", "Web Dev", "GitHub"],
    "Undergraduate Student (Medical)": ["Anatomy", "Clinical Skills", "Bioinformatics"],
    "Postgraduate Student": ["Thesis Writing", "Advanced Research", "Presentation Skills"],
    "PhD Scholar": ["Paper Writing", "Deep Learning", "Research Methodologies"],
    "Researcher": ["Data Analysis", "Publishing", "Statistical Tools"],
    "Working Professional (Tech)": ["System Design", "Cloud", "DevOps"],
    "Working Professional (Non-Tech)": ["Leadership", "Excel", "Public Speaking"],
    "Entrepreneur": ["Startup Pitching", "Fundraising", "Marketing"],
    "Freelancer": ["Client Handling", "Portfolio Building", "Online Platforms"],
    "Educator": ["Curriculum Design", "Assessment Tools", "EdTech"],
    "School Teacher": ["Child Psychology", "Digital Classrooms", "Creative Teaching"],
    "College Professor": ["Research Supervision", "Academic Writing", "Grant Proposals"],
    "Mentor": ["Coaching", "Listening Skills", "Feedback Giving"],
    "Job Seeker": ["Resume Building", "Interview Prep", "LinkedIn Optimization"],
    "Startup Founder": ["Fundraising", "Pitch Deck", "Team Building"],
    "Product Manager": ["Product Lifecycle", "Jira", "Agile Methods"],
    "UI/UX Designer": ["Figma", "User Research", "Design Thinking"],
    "Data Analyst": ["Excel", "Power BI", "SQL", "Python"],
    "Machine Learning Engineer": ["TensorFlow", "Pytorch", "MLOps"],
    "Doctor": ["Clinical Practice", "Ethics", "Medical Software"],
    "Nurse": ["First Aid", "Patient Care", "Communication"],
    "Pharmacist": ["Drug Database", "Inventory", "Dosage Calculation"],
    "Law Student": ["Legal Writing", "Court Proceedings", "Case Studies"],
    "Civil Services Aspirant": ["Current Affairs", "Ethics", "Essay Writing"],
    "CA/CS Student": ["Taxation", "Audit", "Company Law"],
    "Finance Professional": ["Financial Modelling", "Valuation", "Excel"],
    "Investor": ["Portfolio Strategy", "Risk Analysis", "Stock Market"],
    "Artist": ["Digital Art", "Storyboarding", "Art Selling"],
    "Content Creator": ["Video Editing", "SEO", "Social Media"],
    "Journalist": ["Investigative Writing", "Interviewing", "News Ethics"],
    "NGO Volunteer": ["Fundraising", "Event Planning", "Impact Measurement"],
    "Community Manager": ["Discord Management", "Community Engagement", "Analytics"],
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
        <motion.section className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6 min-h-screen flex flex-col items-center">
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
                                className="bg-white text-blue-600 rounded-xl p-4 font-semibold text-center cursor-pointer flex flex-col items-center justify-center space-y-2 hover:scale-105 transition"
                                onClick={() => setSelectedRole(role)}
                            >
                                <div className="text-3xl">{icon}</div>
                                <div className="text-sm md:text-base">{role}</div>
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
                                    className={`cursor-pointer flex flex-col items-center justify-center px-6 py-5 rounded-2xl shadow-md transition-all duration-200 border-2 text-center h-36 ${selectedSkill === skill
                                        ? "bg-green-200 text-black border-green-400 shadow-lg"
                                        : "bg-white text-blue-600 border-blue-200 hover:shadow-lg"
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
                                    className="w-full p-3 rounded-lg text-black border border-gray-300"
                                    value={customSkill}
                                    onChange={(e) => setCustomSkill(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                            <button
                                type="button"
                                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
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
                                className="px-6 py-2 bg-green-400 text-black font-semibold rounded-md hover:bg-green-500 transition disabled:opacity-50"
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

import mongoose from "mongoose";

interface ISkillTracker {
    skill: string;
    learningGoal: string;
    tasksDone: {
      taskId:string;
      topic: string;
      startTime: Date;
      endTime: Date;
      feedback: string;
      rating: number;
    }[];
    currentLevel: string;
    progress: number;
  }
  
export type SignupData = {
    name : string;
    email : string;
    password : string;
    currentRole : string;
    skillTracker : ISkillTracker[];
    badges : string[];
}
export type FormData = {
    name: string;
    email: string;
    password: string;
    currentRole: string;
    purpose: string[];
    skills: string[];
    badges:string[];
};

export const currentRoleOptions: string[] = ['College Student', 'Working Professional','Other'];

export const purposeOptions = {
    'College Student': ['Learn new skills in tech', 'Prepare for internships/jobs', 'Build projects'],
    'Working Professional': ['Career growth', 'Upskill in tech', 'Learn advanced topics'],
};

export const skillsOptions = {
    'Learn new skills in tech': ['Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing'],
    'Prepare for internships/jobs': ['Coding Interviews', 'Resume Building', 'Networking'],
    'Build projects': ['Full-Stack Development', 'Mobile App Development', 'IoT Projects'],
    'Learn advanced topics': ['Deep Learning', 'Blockchain', 'Quantum Computing'],
    'Career growth': ['Leadership Skills', 'Technical Certifications', 'Mentorship'],
    'Upskill in tech': ['DevOps', 'Cybersecurity', 'Big Data'],
};

export const handleChange = (
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

export const handlePurposeChange = (setFormData: React.Dispatch<React.SetStateAction<FormData>>, purpose: string) => {
    setFormData((prev) => {
        const updatedPurpose = prev.purpose.includes(purpose)
            ? prev.purpose.filter((p) => p !== purpose)
            : [...prev.purpose, purpose];
        return { ...prev, purpose: updatedPurpose };
    });
};

export const handleSkillChange = (setFormData: React.Dispatch<React.SetStateAction<FormData>>, skill: string) => {
    setFormData((prev) => {
        const updatedSkills = prev.skills.includes(skill)
            ? prev.skills.filter((s) => s !== skill)
            : [...prev.skills, skill];
        return { ...prev, skills: updatedSkills };
    });
};

export const validateStep = (step: number, formData: FormData): boolean => {
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

export const leftSectionContent = (step: number) => {
    switch (step) {
        case 1:
            return {
                title: "Welcome to LearnEra",
                description: "Create your account to unlock personalized learning paths and resources.",
            };
        case 2:
            return {
                title: "Welcome to LearnEra",
                description: "Tell us about your current role to customize your learning journey.",
            };
        case 3:
            return {
                title: "Welcome to LearnEra",
                description: "Select your goals to help us recommend the best content for you.",
            };
        case 4:
            return {
                title: "Welcome to LearnEra",
                description: "Choose the skills you want to focus on to achieve your goals.",
            };
        default:
            return {
                title: "Welcome to LearnEra",
                description: "Start your journey to mastering new skills and achieving your goals.",
            };
    }
};
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




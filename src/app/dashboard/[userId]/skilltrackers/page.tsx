// app/dashboard/[userId]/skilltrackers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SkillsToLearn from "@/components/tasks/skillsToLearn";
import TutorComments from "@/components/tasks/TutorComments";

interface TaskData1 {
  day: string;
  tasks: number;
}

interface SkillProgress {
  idx: string;
  skill: string;
  data: TaskData1[];
}

const SkillTrackersPage: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchSkillProgress = async () => {
      try {
        const response = await fetch(`/api/dashboard/${userId}/skilltrackers`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: SkillProgress[] = await response.json();
        setSkillProgress(data);
      } catch (error) {
        console.error("Error fetching skill progress:", error);
      }
    };

    fetchSkillProgress();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 overflow-x-hidden p-8">
      <TutorComments />
      <SkillsToLearn skills={skillProgress} />
    </div>
  );
};

export default SkillTrackersPage;

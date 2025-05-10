"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

type Skill = {
  idx: string;
  skill: string;
  isOnboarded: boolean;
  data: { day: string; tasks: number }[];
};

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const actualTasks = payload[0].payload.actualTasks;
    return (
      <div className="bg-[#2a2a2a] text-white p-2 rounded-md shadow-lg">
        <p>{`Tasks Completed: ${actualTasks}`}</p>
      </div>
    );
  }
  return null;
};

const SkillsToLearn = ({ skills }: { skills: Skill[] }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(()=>{
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("User ID from localStorage:", storedUserId);
    } else {
      router.push("/login");
    }
  },[])
  const handleLearnMore = (trackerId: string) => {
    router.push(`/skilltrackers/${trackerId}/tasks`);
  };
  const handleOnboard = (trackerId: string, skill:string) => {
    router.push(`/skilltrackers/${trackerId}/onboard?skill=${skill}`);
  }
  // const handleViewProgress = (trackerId: string) => {
  //   router.push(`/skilltrackers/${trackerId}/progress`)
  // }
  return (
    <div className="mt-8">
      <div className="flex gap-3">
        <Button className="bg-gray-700 text-white px-4 py-2 flex items-center gap-2" onClick={()=>{router.push(`/dashboard/${userId}`)}}>
            <ArrowLeft size={18} /> Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-white mb-4">📚 Skills to Learn</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="p-5 bg-[#1e1e1e] border border-[#2c2c2c] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-semibold text-white">{skill.skill}</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={skill.data.map((d) => ({
                  ...d,
                  displayTasks: d.tasks === 0 ? 0.1 : d.tasks,
                  actualTasks: d.tasks,
                }))}
              >
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis domain={[0, "dataMax + 1"]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="displayTasks" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
              {skill.isOnboarded ? (
                <div className="flex gap-5">
                  {/* <Button
              className="mt-3 bg-black text-white w-full rounded-lg py-2 hover:bg-gray-700 transition-colors"
              onClick={() => handleViewProgress(skill.idx)}
            >
              View Progress
            </Button> */}
                  <Button
              className="mt-3 bg-black text-white w-full rounded-lg py-2 hover:bg-gray-700 transition-colors"
              onClick={() => handleLearnMore(skill.idx)}
            >
              Learn More
            </Button>
                </div>
                ) : (
                <Button
                className="mt-3 bg-black text-white w-full rounded-lg py-2 hover:bg-gray-700 transition-colors"
                onClick={() => handleOnboard(skill.idx, skill.skill)}
              >
                Onboard Now
              </Button>
            )}
            
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsToLearn;

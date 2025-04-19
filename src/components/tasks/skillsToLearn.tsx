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

type Skill = {
  idx: string;
  skill: string;
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

const SkillsToLearn = ({
  skills,
  onSelectSkill,
}: {
  skills: Skill[];
  onSelectSkill: (skill: string) => void;
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">📚 Skills to Learn</h2>
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
                  displayTasks: d.tasks === 0 ? 0.1 : d.tasks, // Raise bar height for 0 tasks
                  actualTasks: d.tasks, // Store actual task count for tooltip
                }))}
              >
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis domain={[0, "dataMax + 1"]} hide /> {/* Ensures bars are never at 0 */}
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="displayTasks" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Button
              className="mt-3 bg-black text-white w-full rounded-lg py-2 hover:bg-gray-700 transition-colors"
              onClick={() => onSelectSkill(skill.skill)}
            >
              Learn More
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsToLearn;

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

type Skill = {
  skill: string;
  data: { day: string; tasks: number }[];
};

const SkillsToLearn = ({ skills, onSelectSkill }: { skills: Skill[]; onSelectSkill: (skill: string) => void }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">📚 Skills to Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-semibold">{skill.skill}</h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={skill.data}>
                <XAxis dataKey="day" stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Button className="mt-3 bg-black w-full text-white" onClick={() => onSelectSkill(skill.skill)}>
              Learn More
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsToLearn;

import { motion } from "framer-motion";

const TutorComments = () => {
  const userSummary =
    "🚀 Based on your activity, you've shown strong skills in Web Development and Machine Learning. Your problem-solving speed has improved by 15% over the last month! Keep up the great work!";

  return (
    <motion.div
      className="bg-gray-800/80 p-6 rounded-xl shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-2">💬 Tutor Comments</h2>
      <p className="text-gray-300">{userSummary}</p>
    </motion.div>
  );
};

export default TutorComments;

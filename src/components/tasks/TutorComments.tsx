import { motion } from "framer-motion";

const TutorComments = () => {
  const userSummary =
    "🚀 Based on your activity, you've shown strong skills in Web Development and Machine Learning. Your problem-solving speed has improved by 15% over the last month! Keep up the great work!";

  return (
    <motion.div
      className="p-6 bg-gray-800 border border-gray-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center mr-4"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-white text-2xl font-bold">💬</span>
        </motion.div>
        <h2 className="text-2xl font-semibold text-white">Tutor Comments</h2>
      </div>

      <p className="text-gray-300 text-lg leading-relaxed">{userSummary}</p>
    </motion.div>
  );
};

export default TutorComments;

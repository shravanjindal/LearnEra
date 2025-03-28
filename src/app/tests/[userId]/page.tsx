"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TestsPage = () => {
  const { userId } = useParams(); // Get userId from URL

  // AI-generated summary
  const aiSummary =
    "📊 Based on your last tasks and previous performance, I have made following tests to evaluate your progress. All the best! 🚀";

  // Test Categories
  const generalTests = [
    { title: "🖥️ Web Development Basics", description: "Test your knowledge of HTML, CSS, and JavaScript." },
    { title: "📊 Data Science & Pandas", description: "Evaluate your ability to manipulate and analyze datasets." },
    { title: "📊 Data Science & Pandas", description: "Evaluate your ability to manipulate and analyze datasets." },
    { title: "🤖 Machine Learning Fundamentals", description: "Assess your understanding of ML concepts and algorithms." },
  ];

  const practicalTests = [
    { title: "⚡ Build a Responsive Navbar", description: "Write code to create a fully responsive navigation bar." },
    { title: "🔍 Data Cleaning Challenge", description: "Write Python scripts to clean and preprocess a dataset." },
    { title: "🧠 Train an ML Model", description: "Build and train a basic machine learning model using scikit-learn." },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* AI Summary */}
      <motion.div
        className="bg-gray-800 p-6 rounded-xl shadow-xl text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">📌 Tutor Comments </h2>
        <p className="text-gray-300">{aiSummary}</p>
      </motion.div>

      {/* Sections */}
      <div className="mt-8 space-y-10">
        {/* General Tests */}
        <TestSection title="🧠 Knowlegde Tests" tests={generalTests} />

        {/* Practical Tests */}
        <TestSection title="💻 Practical Tests" tests={practicalTests} />
      </div>
    </div>
  );
};

// Reusable Test Section Component
const TestSection = ({ title, tests }: { title: string; tests: { title: string; description: string }[] }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-5 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-semibold text-gray-200">{test.title}</h3>
            <p className="text-gray-400">{test.description}</p>
            <Button className="mt-3 w-full text-white">Start Test</Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestsPage;

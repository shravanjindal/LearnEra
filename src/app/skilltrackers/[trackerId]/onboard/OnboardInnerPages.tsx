"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useSearchParams } from "next/navigation"
import { BookOpen, Sparkles, Briefcase, MoreHorizontal, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
// Define the learning goals and levels for each question
const learningGoals = [
  { id: "academic", label: "Academic purpose", icon: BookOpen },
  { id: "fun", label: "Just for fun", icon: Sparkles },
  { id: "professional", label: "Professional development", icon: Briefcase },
  { id: "other", label: "Other", icon: MoreHorizontal },
]

const currentLevels = [
  { id: "complete_beginner", label: "Complete beginner", description: "I've never tried this before" },
  { id: "beginner", label: "Beginner", description: "I know the basics" },
  { id: "intermediate", label: "Intermediate", description: "I can work with some guidance" },
  { id: "advanced", label: "Advanced", description: "I'm looking to master this skill" },
]

export default function OnboardingPage() {
  const {trackerId} = useParams()
  const params = useSearchParams()
  const [step, setStep] = useState(1)
  const [learningGoal, setLearningGoal] = useState<string | null>(null)
  const [currentLevel, setCurrentLevel] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Assuming you have role and skill data coming from a previous page
  const skill = params.get("skill") || "Coding"
const router = useRouter()
  // Handle next step
  const handleNext = () => {
    if (step === 3) {
      // Send data to API on last step
      handleSubmit()
    } else {
      setStep((prev) => prev + 1)
    }
  }

  // Handle the form submission and send the data
  const handleSubmit = async () => {
    setIsSubmitting(true);  
    try {
        const res = await fetch(`/api/skilltrackers/${trackerId}/onboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill, learningGoal, currentLevel }),
        });
  
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to onboard");
        }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/skilltrackers/${trackerId}/tasks`);
    }
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <motion.div
              key={stepNumber}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-300",
                step >= stepNumber ? "bg-white" : "bg-white/30",
              )}
              animate={{
                scale: step === stepNumber ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: step === stepNumber ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 1.5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <AnimatePresence mode="wait">
          {/* Welcome step */}
          {step === 1 && (
            <motion.div
              key="step1"
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                <h1 className="text-3xl font-bold text-white text-center mb-4">Welcome to Your Learning Journey</h1>

                <p className="text-white/90 text-center mb-8">
                  I'm excited to help you learn {skill}! Let's get to know your goals better.
                </p>

                <Button
                  onClick={handleNext}
                  className="w-full py-6 text-lg bg-white hover:bg-white/90 text-indigo-700 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Let's Begin</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Learning goal step */}
          {step === 2 && (
            <motion.div
              key="step2"
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">What's your learning goal?</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {learningGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      className={cn(
                        "cursor-pointer rounded-xl p-4 transition-all duration-300 border",
                        learningGoal === goal.id
                          ? "bg-white text-indigo-700 border-white"
                          : "bg-white/5 text-white border-white/20 hover:bg-white/10",
                      )}
                      onClick={() => setLearningGoal(goal.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("p-2 rounded-lg", learningGoal === goal.id ? "bg-indigo-100" : "bg-white/10")}
                        >
                          <goal.icon
                            className={cn("w-5 h-5", learningGoal === goal.id ? "text-indigo-700" : "text-white")}
                          />
                        </div>
                        <span className="font-medium">{goal.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!learningGoal}
                  className={cn(
                    "w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                    !learningGoal
                      ? "bg-white/50 text-indigo-900/50 cursor-not-allowed"
                      : "bg-white hover:bg-white/90 text-indigo-700",
                  )}
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Current level step */}
          {step === 3 && (
            <motion.div
              key="step3"
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  What's your current level in {skill}?
                </h2>

                <div className="space-y-4 mb-8">
                  {currentLevels.map((level, index) => (
                    <motion.div
                      key={level.id}
                      className={cn(
                        "cursor-pointer rounded-xl p-4 transition-all duration-300 border",
                        currentLevel === level.id
                          ? "bg-white text-indigo-700 border-white"
                          : "bg-white/5 text-white border-white/20 hover:bg-white/10",
                      )}
                      onClick={() => setCurrentLevel(level.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={cn(
                              "font-semibold text-lg",
                              currentLevel === level.id ? "text-indigo-700" : "text-white",
                            )}
                          >
                            {level.label}
                          </h3>
                          <p
                            className={cn(
                              "text-sm mt-1",
                              currentLevel === level.id ? "text-indigo-700/70" : "text-white/70",
                            )}
                          >
                            {level.description}
                          </p>
                        </div>
                        {currentLevel === level.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            <CheckCircle2 className="w-6 h-6 text-indigo-700" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!currentLevel}
                  className={cn(
                    "w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                    !currentLevel
                      ? "bg-white/50 text-indigo-900/50 cursor-not-allowed"
                      : "bg-white hover:bg-white/90 text-indigo-700",
                  )}
                >
                  <span>{isSubmitting ? "Submitting..." : "Continue"}</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Success step */}
          {step === 4 && (
            <motion.div
              key="step4"
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-4">You're all set!</h2>

                <p className="text-white/90 text-center mb-8">
                  We've customized your learning journey based on your preferences. Get ready to master {skill}!
                </p>

                <Button className="w-full py-6 text-lg bg-white hover:bg-white/90 text-indigo-700 font-medium rounded-xl transition-all duration-300">
                  Start Learning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti effect on completion */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    "#FF5733",
                    "#33FF57",
                    "#3357FF",
                    "#F3FF33",
                    "#FF33F3",
                    "#33FFF3",
                    "#FF3333",
                    "#33FF33",
                  ][Math.floor(Math.random() * 8)],
                  top: "-5%",
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

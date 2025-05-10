"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { BookOpen, Sparkles, Briefcase, MoreHorizontal, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
  const params = useSearchParams()
  const [step, setStep] = useState(1)
  const [learningGoal, setLearningGoal] = useState<string | null>(null)
  const [currentLevel, setCurrentLevel] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Assuming you have role and skill data coming from a previous page
  const role = params.get("role") || "Developer"
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
    setIsSubmitting(true)
    const maxRetries = 3
    let attempts = 0
    let data = null

    try {
      while (attempts < maxRetries) {
        const res = await fetch("/api/welcome/getTopics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, skill, learningGoal, currentLevel }),
        })

        data = await res.json()
        if (res.ok) {
          localStorage.setItem("topicsData", JSON.stringify(data))
          localStorage.setItem(
            "welcomingData",
            JSON.stringify({
              learningGoal,
              currentLevel,
              role,
            }),
          )
          router.push("/skilltrackers/welcome/tasks")
          return // Exit on success
        }

        attempts++
      }

      console.error("Failed to fetch topics after retries.")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl"></div>

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5 backdrop-blur-sm"
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
        <div className="flex items-center space-x-3">
          {[1, 2, 3].map((stepNumber) => (
            <motion.div
              key={stepNumber}
              className={cn(
                "flex items-center justify-center transition-colors duration-300",
                step >= stepNumber
                  ? "w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-white font-medium text-sm"
                  : "w-3 h-3 bg-slate-600 rounded-full",
                step === stepNumber && "ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-slate-900",
              )}
              animate={{
                scale: step === stepNumber ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: step === stepNumber ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 1,
              }}
            >
              {step >= stepNumber && stepNumber}
            </motion.div>
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
                className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(8, 145, 178, 0.2)" }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"
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

                <p className="text-slate-300 text-center mb-8">
                  I'm excited to help you learn {skill}! Let's get to know your goals better.
                </p>

                <Button
                  onClick={handleNext}
                  className="w-full py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group border-0"
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
              <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">What's your learning goal?</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {learningGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      className={cn(
                        "cursor-pointer rounded-xl p-4 transition-all duration-300 border",
                        learningGoal === goal.id
                          ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border-cyan-500/50"
                          : "bg-slate-800/50 text-white border-slate-700/50 hover:border-slate-600/80",
                      )}
                      onClick={() => setLearningGoal(goal.id)}
                      whileHover={{ scale: 1.03, y: -2 }}
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
                          className={cn(
                            "p-2 rounded-lg",
                            learningGoal === goal.id
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                              : "bg-slate-700/70",
                          )}
                        >
                          <goal.icon className="w-5 h-5 text-white" />
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
                    "w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border-0",
                    !learningGoal
                      ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white",
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
              <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl">
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
                          ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border-cyan-500/50"
                          : "bg-slate-800/50 text-white border-slate-700/50 hover:border-slate-600/80",
                      )}
                      onClick={() => setCurrentLevel(level.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
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
                          <h3 className="font-semibold text-lg text-white">{level.label}</h3>
                          <p
                            className={cn(
                              "text-sm mt-1",
                              currentLevel === level.id ? "text-cyan-300/90" : "text-slate-400",
                            )}
                          >
                            {level.description}
                          </p>
                        </div>
                        {currentLevel === level.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full p-1"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!currentLevel || isSubmitting}
                  className={cn(
                    "w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border-0",
                    !currentLevel || isSubmitting
                      ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white",
                  )}
                >
                  <span>{isSubmitting ? "Submitting..." : "Continue"}</span>
                  {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
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
              <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl">
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"
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

                <p className="text-slate-300 text-center mb-8">
                  We've customized your learning journey based on your preferences. Get ready to master {skill}!
                </p>

                <Button className="w-full py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white font-medium rounded-xl transition-all duration-300 border-0">
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
                    "#10B981", // emerald-500
                    "#06B6D4", // cyan-500
                    "#3B82F6", // blue-500
                    "#8B5CF6", // violet-500
                    "#EC4899", // pink-500
                    "#10B981", // emerald-500
                    "#06B6D4", // cyan-500
                    "#3B82F6", // blue-500
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

"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, MousePointer, BarChart2, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface Step {
  title: string
  description: string[]
  images: string[]
  icon: React.ReactNode
}

interface ActiveImageState {
  step: number | null
  image: number | null
}

const steps: Step[] = [
  {
    title: "Step 1: Easy Onboarding",
    description: ["Tell us who you are", "What you want to learn", "Your learning goals", "Your current level"],
    images: [
      "/onboarding1.png",
      "/onboarding2.png",
      "/onboarding3.png",
      "/onboarding4.png",
    ],
    icon: <MousePointer className="w-6 h-6" />,
  },
  {
    title: "Step 2: Personalized Tasks",
    description: [
      "We generate tasks tailored to your level and goals.",
      "Get smart content, interactive tasks, and chatbot support.",
    ],
    images: ["/content.png", "/task.png", "/chatbot.png"],
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    title: "Step 3: Real-Time Progress",
    description: [
      "Track your growth live on your personal dashboard.",
      "Get insights into strengths, weaknesses, and streaks.",
    ],
    images: ["/dashboard.png"],
    icon: <BarChart2 className="w-6 h-6" />,
  },
  
]

// Placeholder images for demonstration
const placeholderImages = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

const HowItWorks: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<ActiveImageState>({
    step: null,
    image: null,
  })
  const [currentCarouselIndices, setCurrentCarouselIndices] = useState<number[]>(steps.map(() => 0))
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isHovering, setIsHovering] = useState<boolean[]>(steps.map(() => false))
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter();
  // Auto-rotate carousel images when not hovering
  useEffect(() => {
    const intervals = steps.map((step, stepIndex) => {
      if (step.images.length > 1 && !isHovering[stepIndex]) {
        return setInterval(() => {
          setCurrentCarouselIndices((prev) => {
            const newIndices = [...prev]
            newIndices[stepIndex] = (prev[stepIndex] + 1) % step.images.length
            return newIndices
          })
        }, 4000)
      }
      return null
    })

    return () => {
      intervals.forEach((interval) => interval && clearInterval(interval))
    }
  }, [isHovering])

  // Handle modal open/close
  const openImageModal = (stepIndex: number, imageIndex: number): void => {
    setActiveImageIndex({ step: stepIndex, image: imageIndex })
    document.body.style.overflow = "hidden"
  }

  const closeImageModal = (): void => {
    setActiveImageIndex({ step: null, image: null })
    document.body.style.overflow = "auto"
  }

  // Handle mouse hover for pausing carousel
  const handleMouseEnter = (stepIndex: number) => {
    setIsHovering((prev) => {
      const newState = [...prev]
      newState[stepIndex] = true
      return newState
    })
  }

  const handleMouseLeave = (stepIndex: number) => {
    setIsHovering((prev) => {
      const newState = [...prev]
      newState[stepIndex] = false
      return newState
    })
  }

  // Scroll to step when clicking on step indicator
  const scrollToStep = (index: number) => {
    setActiveStep(index)
    if (carouselRefs.current[index]) {
      carouselRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  // Intersection observer to update active step based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = carouselRefs.current.findIndex((ref) => ref === entry.target)
            if (index !== -1) {
              setActiveStep(index)
            }
          }
        })
      },
      { threshold: 0.6 },
    )

    carouselRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      carouselRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen px-6 py-20 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
            How It Works
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Our streamlined process makes learning efficient and personalized to your needs
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="hidden md:flex justify-center mb-16 gap-4">
          {steps.map((step, index) => (
            <button
              key={`step-indicator-${index}`}
              onClick={() => scrollToStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeStep === index
                  ? "bg-white/10 border border-white/20 shadow-lg"
                  : "bg-transparent hover:bg-white/5"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep === index ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-white/10"
                }`}
              >
                {index + 1}
              </div>
              <span className={activeStep === index ? "opacity-100" : "opacity-70"}>{step.title.split(":")[0]}</span>
            </button>
          ))}
        </div>

        {steps.map((step, stepIndex) => (
          <motion.div
            key={stepIndex}
            ref={(el) => {
              carouselRefs.current[stepIndex] = el;
            }}
            className={`flex flex-col ${
              stepIndex % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center justify-between gap-12 mb-32 relative`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Connecting line between steps */}
            {stepIndex < steps.length - 1 && (
              <div className="absolute left-1/2 md:left-auto md:top-1/2 bottom-0 md:bottom-auto transform translate-x-[-50%] md:translate-x-0 md:translate-y-[-50%] w-px md:w-full h-32 md:h-px bg-gradient-to-b md:bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            )}

            {/* Image display */}
            <div
              className="md:w-1/2 w-full"
              onMouseEnter={() => handleMouseEnter(stepIndex)}
              onMouseLeave={() => handleMouseLeave(stepIndex)}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative aspect-video w-full bg-slate-800/50 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(8,145,178,0.2)] border border-slate-700/50 backdrop-blur-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCarouselIndices[stepIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={() => openImageModal(stepIndex, currentCarouselIndices[stepIndex])}
                    >
                      <Image
                        src={step.images[currentCarouselIndices[stepIndex]]}

                        alt={`${step.title} - Image ${currentCarouselIndices[stepIndex] + 1}`}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white/90 bg-slate-800/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                        {step.title.split(":")[1] || step.title}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel indicators */}
                {step.images.length > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {step.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentCarouselIndices[stepIndex] === imgIndex
                            ? "bg-cyan-400 scale-125"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        onClick={() => {
                          setCurrentCarouselIndices((prev) => {
                            const newIndices = [...prev]
                            newIndices[stepIndex] = imgIndex
                            return newIndices
                          })
                        }}
                        aria-label={`View image ${imgIndex + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Text content */}
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-cyan-500/20">
                  {step.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                  {step.title}
                </h3>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <ul className="space-y-3 text-lg">
                  {step.description.map((desc, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                      <span className="text-slate-200">{desc}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick = {() => router.push("/welcome")}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {activeImageIndex.step !== null && activeImageIndex.image !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl aspect-video bg-slate-900/80 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={steps[activeImageIndex.step].images[activeImageIndex.image]}

                alt={`${steps[activeImageIndex.step].title} - Enlarged view`}
                fill
                className="object-contain"
              />

              {/* Navigation controls for multiple images */}
              {steps[activeImageIndex.step].images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                  {steps[activeImageIndex.step].images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeImageIndex.image === imgIndex ? "bg-cyan-400 scale-125" : "bg-white/40 hover:bg-white/60"
                      }`}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setActiveImageIndex({
                          step: activeImageIndex.step,
                          image: imgIndex,
                        })
                      }}
                      aria-label={`View image ${imgIndex + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image caption */}
              <div className="absolute bottom-16 left-0 right-0 text-center">
                <div className="inline-block bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white/90">
                  {steps[activeImageIndex.step].title}
                </div>
              </div>

              {/* Close button */}
              <button
                className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 text-white transition-all"
                onClick={closeImageModal}
                aria-label="Close image view"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left/Right navigation arrows for multiple images */}
              {steps[activeImageIndex.step].images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-3 text-white transition-all"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      const imagesCount = steps[activeImageIndex.step as number].images.length
                      setActiveImageIndex((prev) => ({
                        step: prev.step,
                        image: prev.image !== null ? (prev.image - 1 + imagesCount) % imagesCount : 0,
                      }))
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-3 text-white transition-all"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      const imagesCount = steps[activeImageIndex.step as number].images.length
                      setActiveImageIndex((prev) => ({
                        step: prev.step,
                        image: prev.image !== null ? (prev.image + 1) % imagesCount : 0,
                      }))
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HowItWorks

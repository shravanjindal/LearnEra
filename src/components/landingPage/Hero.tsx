"use client"
import React from 'react'
import { motion } from 'framer-motion'
import type { NextPage } from 'next'
import Link from 'next/link'

const Hero: NextPage = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger animations for children
        delayChildren: 0.5, // Delay before children animations start
      },
    },
  }

  // Animation variants for children (heading, paragraph, buttons)
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  // Button hover and tap animations
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  }

  return (
    <motion.section
      id="hero"
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white text-center py-20 px-6 h-screen flex flex-col justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Animated Heading */}
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-emerald-100"
          variants={childVariants}
        >
          Be the First to Enter a New Era of Learning
        </motion.h2>

        {/* Animated Paragraph */}
        <motion.p
          className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto"
          variants={childVariants}
        >
          Empowering learners with cutting-edge tools and methods to excel in the modern world.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div className="mt-8 flex justify-center gap-4" variants={childVariants}>
          <Link href="/product">
            <motion.button
              className="px-8 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              How it works?
            </motion.button>
          </Link>
          <Link href="/welcome">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero

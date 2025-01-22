"use client"
import React from 'react';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';

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
  };

  // Animation variants for children (heading, paragraph, buttons)
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Button hover and tap animations
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      id="hero"
      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-center py-20 px-6 h-screen flex flex-col justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Heading */}
      <motion.h2
        className="text-4xl md:text-6xl font-bold"
        variants={childVariants}
      >
        Be the First to Enter a New Era of Learning
      </motion.h2>

      {/* Animated Paragraph */}
      <motion.p
        className="mt-4  text-blue-200  text-lg md:text-xl"
        variants={childVariants}
      >
        Empowering learners with cutting-edge tools and methods to excel in the modern world.
      </motion.p>

      {/* Animated Buttons */}
      <motion.div
        className="mt-6 flex justify-center"
        variants={childVariants}
      >
        <motion.button
          className="mx-3 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-200"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Live Demo
        </motion.button>
        <motion.button
          className="mx-3 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-200"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
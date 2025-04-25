"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ProductDemo = () => {
  // Animation containers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      id="product-demo"
      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center px-6 py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-8"
        variants={childVariants}
      >
        Product Demo & How to Use
      </motion.h2>

      {/* Video */}
      <motion.div
        className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-lg mb-10"
        variants={childVariants}
      >
        <iframe
          className="w-full h-full"
          src="https://drive.google.com/file/d/13PxyyZoAzWg6SybFMvWLc9dQQ-qiV3om/preview"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Product Demo Video"
        ></iframe>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap gap-6 justify-center"
        variants={childVariants}
      >
        <Link href="/login">
          <motion.button
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Login
          </motion.button>
        </Link>
        <Link href="/welcome">
          <motion.button
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default ProductDemo;

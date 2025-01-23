"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface WorkingCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode; // Add an icon prop
}

const WorkingCard: React.FC<WorkingCardProps> = ({ title, description, icon }) => {
  return (
    <div className='hover:scale-105  transform  transition duration-300'>
        <motion.div
      className="h-60 max-w-sm bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 50 }} // Start 50px below
      whileInView={{ opacity: 1, y: 0 }} // Slide up to original position
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view
      transition={{ duration: 0.8 }} // Smooth transition
    >
      <div className="p-6 text-center ">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 flex items-center justify-center bg-purple-200 text-purple-700 rounded-full shadow-md">
            {icon} {/* Render the icon */}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-2xl font-bold text-indigo-600 mb-2">{title}</h4>

        {/* Description */}
        <p className="text-gray-700">{description}</p>
      </div>
    </motion.div>
    </div>
    
  );
};

export default WorkingCard;
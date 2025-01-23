"use client"
import React from 'react'
import { motion } from 'framer-motion';

interface CommentCardProps {
  comment: string;
  company: string;
  name : string;
  occupation : string;
}

const CommentCard: React.FC<CommentCardProps> = ({ name, occupation, company, comment}) => {
  return (
    <div className='hover:scale-105  transform  transition duration-300'>
        <motion.div
      className="max-w-sm bg-white rounded-lg shadow-2xl p-8"
      initial={{ opacity: 0, y: 50 }} // Start 50px below
      whileInView={{ opacity: 1, y: 0 }} // Slide up to original position
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view
      transition={{ duration: 0.8 }} // Smooth transition
    >
       <div>
                <p className="text-gray-700 italic text-lg">{comment}</p>
                <h4 className="mt-6 text-indigo-600 font-semibold text-xl">- {name}</h4>
                <p className="text-indigo-600 text-l">{occupation} at {company}</p>
            </div>
    </motion.div>
    </div>
  )
}

export default CommentCard
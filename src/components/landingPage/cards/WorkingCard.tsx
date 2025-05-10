"use client"
import React from 'react'
import { motion } from 'framer-motion'

interface WorkingCardProps {
  stepNumber: number
  title: string
  description: string
  icon: React.ReactNode
}

const WorkingCard: React.FC<WorkingCardProps> = ({ stepNumber, title, description, icon }) => {
  return (
    <motion.div
      className="h-64 w-full max-w-sm transform transition duration-300 hover:-translate-y-2"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center shadow-lg shadow-slate-900/30 hover:shadow-cyan-500/10 transition-all duration-300">
        {/* Step Number */}
        <div className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-white font-bold shadow-lg shadow-cyan-500/20">
          {stepNumber}
        </div>
        
        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="h-16 w-16 flex items-center justify-center bg-slate-700/50 text-cyan-400 rounded-full shadow-inner">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-2xl font-bold text-white mb-3">{title}</h4>

        {/* Description */}
        <p className="text-slate-300">{description}</p>
      </div>
    </motion.div>
  )
}

export default WorkingCard

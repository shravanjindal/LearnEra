"use client"
import type { NextPage } from "next"
import { motion } from "framer-motion"

const FAQs: NextPage = () => {
  return (
    <section
      id="faqs"
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.h3
          className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          FAQs
        </motion.h3>

        <div className="mt-8 max-w-3xl mx-auto text-left">
          <motion.details
            className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <summary className="font-bold text-cyan-400 cursor-pointer text-xl">What is Zovite?</summary>
            <p className="mt-4 text-slate-300">
              Zovite is a platform designed to revolutionize the way people learn, offering a wide range of courses and
              tools to enhance your learning experience.
            </p>
          </motion.details>

          <motion.details
            className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <summary className="font-bold text-cyan-400 cursor-pointer text-xl">How do I get started?</summary>
            <p className="mt-4 text-slate-300">Just click Get started! And the tutor will take care from there.</p>
          </motion.details>

          <motion.details
            className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <summary className="font-bold text-cyan-400 cursor-pointer text-xl">
              Is there a free trial available?
            </summary>
            <p className="mt-4 text-slate-300">
              We are currently offering free services only. Learn as much as you want.
            </p>
          </motion.details>
        </div>
      </div>
    </section>
  )
}

export default FAQs

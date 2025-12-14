"use client"

import { motion } from "framer-motion"

export default function WorkshopCard({ title, description, duration, level, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group card-dark hover:border-neon-magenta/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-magenta/20"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-rajdhani font-bold uppercase text-neon-magenta group-hover:text-neon-cyan transition-colors flex-1">
          {title}
        </h3>
        <span className="text-xs font-jetbrains bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded-full whitespace-nowrap ml-2">
          {level}
        </span>
      </div>

      <p className="font-poppins text-muted-text mb-4 leading-relaxed min-h-14">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-neon-magenta/10">
        <span className="text-sm font-poppins text-muted-text flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
          </svg>
          {duration}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-poppins font-semibold text-neon-cyan hover:text-neon-magenta transition-colors"
        >
          
        </motion.button>
      </div>
    </motion.div>
  )
}

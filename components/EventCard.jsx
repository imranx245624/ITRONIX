"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function EventCard({ event, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group card-dark hover:border-neon-cyan/60 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{event.icon}</span>
        <span className="text-xs font-jetbrains bg-cyber-orange/20 text-cyber-orange px-3 py-1 rounded-full">
          {event.team_size}
        </span>
      </div>

      <h3 className="text-xl font-rajdhani font-bold uppercase text-neon-cyan group-hover:text-neon-magenta transition-colors mb-2">
        {event.title}
      </h3>

      <p className="font-poppins text-muted-text mb-4 leading-relaxed line-clamp-3 flex-1">{event.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 font-poppins"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-neon-cyan/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-poppins text-neon-cyan">Prize Pool</span>
          <span className="font-rajdhani font-bold text-neon-magenta text-lg">{event.prize}</span>
        </div>

        {/* <Link
          href={event.register_url}
          className="block w-full text-center btn-secondary hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
        >
          Register
        </Link> */}
      </div>
    </motion.div>
  )
}

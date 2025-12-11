"use client"

import { motion } from "framer-motion"

export default function EventsBanner() {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* Background image with cartoon effect and blur */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/image.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.95) blur(4px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-deep-night/80 via-deep-night/60 to-deep-night/80" />

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl md:text-5xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan text-center mb-3">
          Featured Events
        </h1>
        <p className="text-lg md:text-xl font-poppins text-neon-cyan/80 text-center max-w-2xl">
          Competitions & experiences across Tech , Innovation & Cyber Arena
        </p>
      </motion.div>
    </div>
  )
}

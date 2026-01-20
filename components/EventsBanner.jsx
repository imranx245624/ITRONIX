"use client"

import { motion } from "framer-motion"

export default function EventsBanner() {
  return (
    <div className="relative w-full h-90 md:h-80 overflow-hidden">
      {/* Background image with cartoon effect and blur */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/bg1.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.95) blur(1px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-deep-night/80 via-deep-night/60 to-deep-night/80" />

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="top-20 relative h-full flex flex-col items-center  px-4 sm:px-6 lg:px-8"
      >
        <div className=""> 
        <h1 className="relative w-full top-10 text-4xl md:text-5xl font-serif font-bold uppercase tracking-wider text-neon-cyan text-center mb-3">
          Featured <br/> Events
        </h1>
        <p className="relative w-full top-10 font-serif text-lg md:text-xl font-poppins  text-center max-w-2xl">
          Competitions & experiences across Tech , Creative & Cyber Arena
        </p>
         
        </div>
        
      </motion.div>
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce flex flex-col items-center gap-2 text-neon-cyan/70">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}

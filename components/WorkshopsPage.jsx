"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function WorkshopsPage() {
  const workshops = [
    {
      id: "ai-ml",
      title: "AI & ML Bootcamp",
      description:
        "2-hour hands-on labs with Kaggle-like datasets. Learn neural networks, classification, and real-world applications. Certificate included.",
      duration: "2 hours",
      level: "Intermediate",
    },
    {
      id: "iot",
      title: "IoT & Embedded Systems",
      description: "Build an IoT sensor prototype. Hands-on with Arduino and sensors.",
      duration: "3 hours",
      level: "Beginner",
    },
    {
      id: "web-dev",
      title: "Web Dev: From Idea to Launch",
      description: "Full-stack workflow: design, code, deploy. Leave with a live mini-app.",
      duration: "4 hours",
      level: "Intermediate",
    },
  ]

  // framer variants (unchanged logic)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Use mounted flag so animations run reliably on client navigation too
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-deep-night py-20 px-4 sm:px-6 lg:px-8">
      {/* Background image (behind) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none -z-10"
        style={{
          backgroundImage: "url(/images/bg1.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.95) blur(0px)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-night/80 via-deep-night/60 to-deep-night/80 pointer-events-none -z-10" />

      {/* Header / intro - animate on mount */}
      <motion.div
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 max-w-3xl mx-auto text-center mb-12"
      >
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-3">
          LEARNING WORKSHOPS
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-xl font-poppins text-neon-cyan/80 mx-auto">
          Upskill with industry experts. Hands-on workshops across AI, IoT, and Web Development. Limited seats available — apply early!
        </motion.p>
      </motion.div>

      <div className="max-w-6xl mx-auto z-10">
        {/* Workshop Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {workshops.map((workshop) => (
            <motion.article
              key={workshop.id}
              variants={itemVariants}
             className="relative card-dark hover:border-neon-magenta/50 transition-all duration-300 group p-6"

              // className="relative card-dark hover:border-neon-magenta/50 transition-all duration-300 group p-6"
            >
              <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-3 group-hover:text-cyber-orange transition-colors">
                {workshop.title}
              </h3>

              <p className="text-muted-text font-poppins text-sm mb-4">{workshop.description}</p>

              <div className="space-y-2 mb-6 border-t border-neon-cyan/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-neon-cyan text-xs font-semibold uppercase">Duration</span>
                  <span className="text-muted-text text-sm">{workshop.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neon-cyan text-xs font-semibold uppercase">Level</span>
                  <span className="px-2 py-1 bg-neon-magenta/20 text-neon-magenta text-xs font-semibold rounded">
                    {workshop.level}
                  </span>
                </div>
              </div>

              {/* <Link
                href={`/register?workshop=${workshop.id}`}
                className="block w-full text-center btn-secondary hover:shadow-lg hover:shadow-neon-magenta/50 transition-all duration-300"
              >
                Apply Now
              </Link> */}
              <p className="block w-full text-center btn-secondary ">
              Not available right now </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="min-h-screen bg-deep-night py-20 px-4 sm:px-6 lg:px-8">
       <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/bg1.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.95) blur(0px)",
        }}
      />
        
      <div className="absolute inset-0 bg-gradient-to-r from-deep-night/80 via-deep-night/60 to-deep-night/80" />

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="top-20 relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className=""> 
        <h1 className=" text-4xl md:text-5xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan text-center mb-3">
          LEARNING WORKSHOPS
        </h1>
        <p className=" text-lg md:text-xl font-poppins text-neon-cyan/80 text-center max-w-2xl">
           Upskill with industry experts. Hands-on workshops across AI, IoT, and Web Development. Limited seats
            available — apply early!
        </p>
        </div>
      </motion.div>

      
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h1 className="section-title mb-4">LEARNING WORKSHOPS</h1>
          <p className="text-muted-text font-poppins max-w-3xl mx-auto">
            Upskill with industry experts. Hands-on workshops across AI, IoT, and Web Development. Limited seats
            available — apply early!
          </p>
        </motion.div> */}

        {/* Workshop Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {workshops.map((workshop) => (
            <motion.div
              key={workshop.id}
              variants={itemVariants}
              className="top-40 relative card-dark hover:border-neon-magenta/50 transition-all duration-300 group"
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

              <Link
                href={`/register?workshop=${workshop.id}`}
                className="block w-full text-center btn-secondary hover:shadow-lg hover:shadow-neon-magenta/50 transition-all duration-300"
              >
              NOT AVAILABLE RIGHT NOW
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

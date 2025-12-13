"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function SponsorsPage() {
  const sponsorshipTiers = [
    {
      title: "Platinum",
      price: "₹50,000",
      benefits: [
        "Logo on hero",
        "Stage branding",
        "Website hero + footer placement",
        "Primary logo on posters & brochures",
        "Large logo on certificates",
        "Workshop sponsor (full naming rights)",
        "Campus stall (prime location)",
        "5 internship slots",
        "4 VIP passes",
        "5 social posts + 3 email mentions",
        "Sponsor video/logo animation",
        "Stage mention + 2-min address",
      ],
      accent: "neon-cyan",
    },
    {
      title: "Gold",
      price: "₹30,000",
      benefits: [
        "Logo on materials",
        "One workshop sponsorship",
        "Social shoutouts",
        "Website sponsors page (top row)",
        "Medium logo on posters",
        "Medium logo on certificates",
        "Standard campus stall",
        "2–3 internship slots",
        "Stage-side banners",
        "2 VIP passes",
      ],
      accent: "cyber-orange",
    },
    {
      title: "Silver",
      price: "₹10,000",
      benefits: [
        "Logo on posters (small)",
        "Small logo on certificates",
        "Website sponsors page (third row)",
        "Event-day sponsor banner",
        "Flyers at info desk",
        "1 pass",
      ],
      accent: "neon-magenta",
    },
    {
      title: "Premium",
      price: "₹8,000",
      benefits: [
        "Logo on homepage sponsors carousel",
        "Medium logo on posters",
        "Co-sponsor a workshop or session",
        "2 social media posts",
        "1–2 passes",
        "Provide branded prizes/gifts",
      ],
      accent: "neon-magenta",
    },
    {
      title: "Classic",
      price: "₹5000",
      benefits: [
        "Listed on Sponsors page (text/mini logo)",
        "Small logo on posters",
        "Group social post mention",
        "Flyers at registration table",
        "Coupons/offers allowed",
      ],
      accent: "neon-magenta",
    },
  ]

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

  // mounted flag ensures animations run on client navigation
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-deep-night py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto z-10">
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mb-8 text-center"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-3">
            SPONSORS & PARTNERS
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl font-poppins text-neon-cyan/80 max-w-2xl">
            Local partners supporting student innovation. Interested to sponsor ITRONIX? contact
          </motion.p>
        </motion.div>

        {/* Sponsors logos grid */}
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative card-dark flex items-center justify-center h-48 group hover:border-neon-cyan/50 transition-all duration-300 p-6"
            >
              <div className="text-center">
                <div className="text-3xl text-neon-cyan/50 group-hover:text-neon-cyan transition-colors mb-2">📦</div>
                <p className="text-xs text-muted-text group-hover:text-neon-cyan transition-colors">Sponsor {i + 1}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact / tiers area (kept commented blocks as in original) */}
        {/* ... (commented sponsorship tiers remain untouched) */}

        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center card-dark border-2 border-neon-cyan p-8"
        >
          <motion.p variants={itemVariants} className="text-muted-text font-poppins mb-4">
            Ready to sponsor ITRONIX?
          </motion.p>
          <motion.p variants={itemVariants} className="text-2xl font-rajdhani font-bold text-neon-cyan mb-6">
            itronix@gurunanak.edu.in
          </motion.p>
          <motion.a variants={itemVariants} href="mailto:itronix@gurunanak.edu.in?subject=Sponsorship Inquiry - ITRONIX-2K26" className="inline-block btn-primary">
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

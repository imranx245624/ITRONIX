"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function SponsorsPage() {
  const sponsorshipTiers = [
  {
    title: "Platinum",
    price: "₹50,000",
    benefits: [
      "Official 'Powered By' Partner",
      "Title mention (e.g. ITRONIX 2026 – Powered by Brand)",
      "Featured on all posters, social media & website",
      "Primary logo on stage backdrop & main entrance banner",
      "Large logo on all posters",
      "Prime placement on merchandise (T-shirt/Hoodie)",
      "Priority placement on website & registration page",
      "Sponsor highlight reel/post",
      "Sponsor video (20–30 sec) showcased at event",
      "Premium campus stall (best location)",
      "Exclusive workshop/talk session opportunity",
      "1-minute stage announcement",
    ],
    accent: "neon-cyan",
  },
  {
    title: "Gold",
    price: "₹30,000",
    benefits: [
      "Official 'Co-Powered By' Partner",
      "Title mention (e.g. ITRONIX 2026 – Co-Powered by Brand)",
      "Logo on posters, website & social media",
      "Medium logo on merchandise",
      "Logo on invitations (main fest)",
      "Logo featured in pre-fest promotional creatives",
      "Social media shoutouts & promo reel/post",
      "Logo on sponsor section of website",
      "Standard campus stall (priority location)",
      "Co-sponsor workshop option",
      "1 stage mention",
    ],
    accent: "cyber-orange",
  },
  {
    title: "Premium",
    price: "₹10,000",
    benefits: [
      "Small logo on posters",
      "Logo on certificates",
      "Logo on website sponsor page",
      "Logo on digital screen / backdrop (side panel)",
      "Mention on invitations (small placement)",
      "Included in sponsor appreciation social post",
      "Eligible for standard stall on request (complimentary)",
      "Can share discount codes or offers",
    ],
    accent: "violet",
  },
  {
    title: "Silver",
    price: "₹8,000",
    benefits: [
      "Medium logo on website sponsor carousel",
      "Small logo on posters",
      "Mention on certificates",
      "1 social media shoutout",
      "Included in sponsor appreciation reel",
      "Mention in WhatsApp/email promotions",
      "Stall not included (upgrade encouraged)",
    ],
    accent: "neon-silver",
  },
  {
    title: "Classic",
    price: "₹5,000",
    benefits: [
      "Name listed on sponsor page",
      "Small logo on posters",
      "Footer mention on certificates",
      "Social media story shoutout",
      "Included in 'Thank You Sponsors' slide during closing ceremony",
    ],
    accent: "neon-gray",
  },
]


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  }

  // small helper to map accent to tailwind class names (adjust if your CSS uses different naming)
  const accentToClass = {
    "neon-cyan": "border-neon-cyan",
    "cyber-orange": "border-cyber-orange",
  
    "violet": "border-violet-500 text-violet-400",
      "neon-silver": "border-white",
  // "neon-silver": "border-neon-silver",
  "neon-gray": "border-neon-gray",
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
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-3"
          >
            SPONSORS & PARTNERS
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl font-poppins text-neon-cyan/80 max-w-2xl">
            Local partners supporting student innovation. Interested to sponsor ITRONIX? Contact us below.
          </motion.p>
        </motion.div>

        {/* Sponsor logos placeholder */}
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative card-dark flex items-center justify-center h-40 group hover:border-neon-cyan/50 transition-all duration-300 p-4 rounded-lg"
            >
              <div className="text-center">
                <div className="text-3xl text-neon-cyan/40 group-hover:text-neon-cyan transition-colors mb-1">📦</div>
                <p className="text-xs text-muted-text group-hover:text-neon-cyan transition-colors">Sponsor {i + 1}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sponsorship tiers grid */}
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {sponsorshipTiers.map((tier, idx) => {
            const borderClass = accentToClass[tier.accent] ?? "border-neon-cyan"
            return (
              <motion.div
                key={tier.title}
                variants={itemVariants}
                className={`card-dark rounded-xl p-6 border-2 ${borderClass} flex flex-col justify-between shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-rajdhani font-bold text-white">{tier.title}</h3>
                    <div className="text-lg font-semibold text-neon-cyan">{tier.price}</div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-muted-text">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-neon-cyan mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293A1 1 0 003.293 10.707l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  {/* <a
                    className="inline-block btn-ghost px-4 py-2 rounded-md text-sm font-semibold"
                    href={`mailto:itronix@gurunanak.edu.in?subject=Sponsorship Inquiry: ${encodeURIComponent(tier.title)}`}
                  >
                    Request Details
                  </a> */}

                  {/* <a
                    className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-bold"
                    href={`mailto:itronix@gurunanak.edu.in?subject=Sponsorship: ${encodeURIComponent(tier.title)}&body=Hello,%0A%0AI%20am%20interested%20in%20the%20${encodeURIComponent(
                      tier.title
                    )}%20tier%20for%20ITRONIX.%20Please%20send%20details.%0A%0ARegards,%0A`}
                  >
                    Get in Touch
                  </a> */}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Contact / CTA */}
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center card-dark border-2 border-neon-cyan p-8 rounded-lg"
        >
          <motion.p variants={itemVariants} className="text-muted-text font-poppins mb-4">
            Ready to sponsor ITRONIX?
          </motion.p>
          <motion.p variants={itemVariants} className="text-2xl font-rajdhani font-bold text-neon-cyan mb-6">
            itronix@gurunanak.edu.in
          </motion.p>
          <motion.a
            variants={itemVariants}
            href="mailto:itronix@gurunanak.edu.in?subject=Sponsorship Inquiry - ITRONIX-2K26"
            className="inline-block btn-primary"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

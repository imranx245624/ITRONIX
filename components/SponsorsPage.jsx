"use client"

import { motion } from "framer-motion"

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
        "Stage mention + 2-min address"
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
      "2 VIP passes"
]
,
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
        "1 pass"
]
,
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
        "Provide branded prizes/gifts"
]
,
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
        "Coupons/offers allowed"
]
,
      accent: "neon-magenta",
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
      <div className="top-50 max-w-6xl mx-auto">
          
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h1 className="section-title mb-4">SPONSORS & PARTNERS</h1>
          <p className="text-muted-text font-poppins max-w-3xl mx-auto mb-2">
            Local partners supporting student innovation. Interested to sponsor ITRONIX?  contact
            us.
          </p>
        </motion.div>

        {/* Sponsor Logos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card-dark flex items-center justify-center h-32 group hover:border-neon-cyan/50 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl text-neon-cyan/50 group-hover:text-neon-cyan transition-colors mb-2">📦</div>
                <p className="text-xs text-muted-text group-hover:text-neon-cyan transition-colors">Sponsor {i + 1}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sponsorship Tiers */}
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16"
        >
          {sponsorshipTiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`card-dark border-2 ${
                tier.accent === "neon-cyan"
                  ? "border-neon-cyan"
                  : tier.accent === "cyber-orange"
                    ? "border-cyber-orange"
                    : "border-neon-magenta"
              }`}
            >
              <h3
                className={`text-2xl font-rajdhani font-bold mb-2 ${tier.accent === "neon-cyan" ? "text-neon-cyan" : tier.accent === "cyber-orange" ? "text-cyber-orange" : "text-neon-magenta"}`}
              >
                {tier.title}
              </h3>
              <p className="text-3xl font-rajdhani font-bold text-holo-pale mb-6">{tier.price}</p>

              <ul className="space-y-3 mb-8">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-text font-poppins text-sm">
                    <span
                      className={`text-${tier.accent === "neon-cyan" ? "neon-cyan" : tier.accent === "cyber-orange" ? "cyber-orange" : "neon-magenta"} mt-1`}
                    >
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <button className="w-full btn-primary">Get in Touch</button>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center card-dark border-2 border-neon-cyan"
        >
          <p className="text-muted-text font-poppins mb-4">Ready to sponsor ITRONIX?</p>
          <p className="text-2xl font-rajdhani font-bold text-neon-cyan mb-6">itronix@gurunanak.edu.in</p>
          <a
            href="mailto:itronix@gurunanak.edu.in?subject=Sponsorship Inquiry - ITRONIX-2K26"
            className="inline-block btn-primary"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}

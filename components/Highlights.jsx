"use client"

import Link from "next/link"

export default function Highlights() {
  const highlights = [
    {
      title: "TECH Events",
      description: "Competitive technical challenges designed to test coding, logic, and real-world problem-solving skills.",
      tags: ["Hackathon","Web Development", "Bug out", "Blind Typing", "code Golf","Vibe coding"],
      href: "/events?filter=hackathon",
      icon: "💻",
    },
    {
      title: "Creative Events",
      description: "Engaging creativity-based activities that blend innovation, imagination, and interactive participation.",
      tags: [ "Treasure Hunt", "PPT Presentation(Techy)","Byte Sized Battles"],
      href: "/events?filter=innovation-fair",
      icon: "💡",
    },
    {
      title: "Cyber Arena",
      description: "High-energy e-sports battles where players compete for skill, strategy, and victory.",
      tags: ["BGMI", "Free Fire", "Ludo King"],
      href: "/events?filter=cyber-arena",
      icon: "🎮",
    },
  ]

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-deep-night/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {highlights.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group card-dark hover:border-neon-magenta/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-3xl sm:text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-2xl font-rajdhani font-bold uppercase text-neon-cyan mb-3 group-hover:text-neon-magenta transition-colors">
                {item.title}
              </h3>
              <p className="font-poppins text-muted-text leading-relaxed text-sm sm:text-base mb-4">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded border border-neon-cyan/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

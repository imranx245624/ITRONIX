"use client"

// import CanvasBackground from "@/components/CanvasBackground"

import "./hero.css"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function Hero() {
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-0 sm:pt-20 bg-deep-night"
    >
      {/* ================= THREE.JS CANVAS BACKGROUND ================= */}
      {/* <CanvasBackground /> */}

      {/* ================= BACKGROUND IMAGE ================= */}
      <img
        ref={imageRef}
        src="/images/bg1.png"
        alt="College campus"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transform-gpu scale-110 animate-kenburns duration-[120s] ease-in-out "
        style={{
          filter: "saturate(1.5) contrast(1.25) brightness(0.7) blur(0.2px) opacity(0.9) ",
          willChange: "transform",
          zIndex: 1,
        }}
      />

      {/* ================= DARK GRADIENT OVERLAY ================= */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-deep-night/70 via-deep-night/50 to-deep-night/70 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-14 sm:mt-0">

        {/* TITLE */}
        <div className="mb-4 sm:mb-6">
          <h1
            className={`relative text-3xl sm:text-4xl lg:text-7xl
              font-serif font-bold tracking-tight sm:tracking-[0.25em]
              bg-gradient-to-r from-neon-cyan via-white to-neon-cyan
              bg-clip-text text-transparent
              drop-shadow-[0_0_20px_rgba(0,255,255,0.35)]
              transition-all duration-300
              whitespace-nowrap sm:whitespace-normal 
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 "}`}
            style={{
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1s ease-out",
            }}
          >
            I T R O N I X
            <span
              className="ml-4 align-middle text-sm sm:text-base lg:text-lg
              px-3 py-1 rounded-full
              border border-neon-cyan/40
              text-neon-cyan tracking-widest font-semibold
              backdrop-blur-sm bg-[rgba(4,8,12,0.36)] 
              drop-shadow-[0_0_10px_rgba(0,255,255,0.25)] "
            >
              2026
            </span>
          </h1>
        </div>

        {/* SUBTITLE */}
        <p className="text-lg sm:text-xl lg:text-2xl font-poppins text-holo-pale mb-2 sm:mb-4">
          <span className="text-neon-cyan text-3xl sm:text-4xl lg:text-3xl font-serif font-bold ">
            Techland
          </span>
          <br />
          <span className="text-neon-cyan italic text-sm sm:text-base lg:text-lg font-semibold ">
            where only the skilled survives
          </span>
        </p>

        <p className="text-sm sm:text-base font-poppins text-muted-text mb-8 sm:mb-12 ">
          Information Technology Department festival
          <br />
          on 23 & 24 Jan 2026
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-xs sm:text-sm font-poppins text-neon-cyan ">
          {["Hackathon", "Web Dev", "Vibe Coding", "Debugging", "Creativity", "Gaming"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]  "
              >
                {tag}
              </span>
            )
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center ">
          <p className="btn-primary block text-center text-xs py-2 mt-2 sm:mt-0 ">
            Registration Start <br /> From 1st January
          </p>

          <Link
            href="/events"
            className="btn-secondary text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3
              transition-all duration-300 transform-gpu
              hover:-translate-y-1 hover:scale-110 hover:rotate-1
              hover:shadow-lg hover:shadow-neon-cyan/50 "
          >
            See Events
          </Link>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce flex flex-col items-center gap-2 text-neon-cyan/70">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}

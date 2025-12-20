"use client"

// import CanvasBackground from "@/components/CanvasBackground"

import "./hero.css"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function Hero() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // overlay progress from 0 to 1 (0 = no overlay, 1 = fully visible)
  const [overlayProgress, setOverlayProgress] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    let rafId = null
    let lastKnownScroll = 0
    let ticking = false

    function updateProgress() {
      const heroEl = heroRef.current
      const heroHeight = (heroEl && heroEl.offsetHeight) || window.innerHeight
      const y = lastKnownScroll
      const progress = Math.min(Math.max(y / heroHeight, 0), 1)
      // Make overlay a bit quicker to appear: map 0..1 -> 0..1 with easing
      const eased = Math.pow(progress, 0.85)
      setOverlayProgress(eased)
      ticking = false
    }

    function onScroll() {
      lastKnownScroll = window.scrollY || window.pageYOffset
      if (!ticking) {
        ticking = true
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    // initialise
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Click overlay => scroll to after hero (smooth)
  const handleOverlayClick = () => {
    const heroEl = heroRef.current
    const target = heroEl ? heroEl.offsetHeight : window.innerHeight
    window.scrollTo({ top: target + 2, behavior: "smooth" })
  }

  // derived style values
  const overlayOpacity = Math.min(1, overlayProgress * 1.15) // slightly boost
  const blurPx = 8 * overlayOpacity // up to 8px blur
  const darkAlpha = 0.55 * overlayOpacity // overlay darkness
  const cardOpacity = Math.min(1, Math.max(0, (overlayProgress - 0.06) * 1.25)) // card appears a bit later
  const cardTranslate = 30 * (1 - cardOpacity) // translate up as it appears

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-0 sm:pt-20 bg-deep-night"
    >
      {/* ================= THREE.JS CANVAS BACKGROUND ================= */}
      {/* <CanvasBackground /> */}

      {/* ================= BACKGROUND IMAGE ================= */}
      <img
        ref={imageRef}
        src="/images/bg1.png"
        alt="College campus"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transform-gpu scale-110 animate-kenburns duration-[120s] ease-in-out"
        style={{
          filter: "saturate(1.5) contrast(1.25) brightness(0.7) blur(0.2px) opacity(0.9)",
          willChange: "transform",
          zIndex: 1,
        }}
      />

      {/* ================= DARK GRADIENT OVERLAY (static) ================= */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-deep-night/70 via-deep-night/50 to-deep-night/70 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* ================= DYNAMIC BLUR + INFO OVERLAY ================= */}
      <div
        // overlay layer sits above everything inside hero
        className="fixed inset-0 z-40 flex items-center justify-center"
        aria-hidden="true"
        onClick={() => {
          // if overlay is visible enough, allow click to jump; otherwise ignore
          if (overlayProgress > 0.02) handleOverlayClick()
        }}
        style={{
          // pointer events only when overlay visible enough
          pointerEvents: overlayProgress > 0.02 ? "auto" : "none",
          transition: "background-color 160ms linear, backdrop-filter 160ms linear",
          backgroundColor: `rgba(2,6,11, ${darkAlpha})`,
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      >
        {/* Info card */}
        <div
          className="max-w-3xl w-[calc(100%-3rem)] sm:w-[760px] p-6 rounded-2xl border border-neon-cyan/20 bg-gradient-to-br from-deep-night/60 to-deep-night/80 shadow-lg text-left"
          style={{
            transform: `translateY(${cardTranslate}px)`,
            opacity: cardOpacity,
            transition: "transform 280ms cubic-bezier(.2,.9,.2,1), opacity 240ms ease-out",
            zIndex: 41,
            cursor: overlayProgress > 0.02 ? "pointer" : "default",
          }}
          onClick={(e) => {
            // prevent bubbling overlay click twice
            e.stopPropagation()
            if (overlayProgress > 0.02) handleOverlayClick()
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-rajdhani text-neon-cyan font-bold mb-2">About ITRONIX</h2>
          {/* <p className="text-sm text-muted-text mb-3">
            ITRONIX — <span className="font-semibold text-neon-cyan">TECHLAND</span> is a futuristic virtual world where technology comes to life.
            Robots, AI, networks and holographic experiences come together to create an immersive IT universe. Explore workshops, competitions and
            live demonstrations.
          </p> */}
          <p className="text-sm text-muted-text mb-3">
            ITRONIX is the annual technical fest of the Information Technology Department,
            celebrating innovation, creativity, and technical excellence. Inspired by the theme
              <strong> TECHLAND</strong>, it represents a futuristic digital world where technology
              comes to life through AI, robotics, networking, and virtual systems. The fest provides 
              a platform for students to learn, compete, collaborate, and experience the future of technology.
          </p>

          <div className="flex justify-center flex-wrap gap-3 mt-2">
            <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">23 — 24 Jan 2026</div><br/>
            {/* <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">Workshops</div>
                        <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">Tech Events</div>

            <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">Creative Events</div>

            <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">Cyber Arena</div> */}
          </div>

          <div className="flex justify-center  mt-5 flex gap-3">
            <Link href="/events" className="inline-block btn-secondary px-4 py-2">
              See Events
            </Link>

            {/* <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                // scroll to next content (hero height)
                const heroEl = heroRef.current
                const top = heroEl ? heroEl.offsetHeight : window.innerHeight
                window.scrollTo({ top: top + 2, behavior: "smooth" })
              }}
              className="inline-block btn-primary px-4 py-2"
            >
              Explore
            </button> */}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-14 sm:mt-0 pointer-events-none">
        {/* NOTE: pointer-events-none here so overlay handles clicks; CTA buttons above have explicit handlers */}
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
          <p className="btn-primary block text-center text-xs py-2 mt-2 sm:mt-0 pointer-events-auto">
            Registration Start <br /> From 1st January
          </p>

          <Link
            href="/events"
            className="btn-secondary text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3
              transition-all duration-300 transform-gpu
              hover:-translate-y-1 hover:scale-110 hover:rotate-1
              hover:shadow-lg hover:shadow-neon-cyan/50 pointer-events-auto"
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

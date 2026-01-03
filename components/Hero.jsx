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
  // if user manually closed the info card, keep it closed until they return to top
  const [overlayClosed, setOverlayClosed] = useState(false)

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

      // if user closed overlay manually: keep it hidden while they scroll down
      if (overlayClosed && y > 60) {
        if (overlayProgress !== 0) setOverlayProgress(0)
        ticking = false
        return
      }

      // if user scrolled back to near-top, re-enable overlay
      if (overlayClosed && y <= 60) {
        setOverlayClosed(false)
      }

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
  }, [overlayClosed, overlayProgress])

  // Click overlay => scroll to after hero (smooth)
  const handleOverlayClick = () => {
    const heroEl = heroRef.current
    const target = heroEl ? heroEl.offsetHeight : window.innerHeight
    window.scrollTo({ top: target + 2, behavior: "smooth" })
  }

  // close button handler
  const handleCloseOverlay = (e) => {
    e.stopPropagation()
    // hide overlay; keep it closed while user scrolls down; will re-open when they come back to top
    setOverlayClosed(true)
    setOverlayProgress(0)
  }

  // derived style values
  const overlayOpacity = Math.min(1, overlayProgress * 1.15) // slightly boost
  const blurPx = 8 * overlayOpacity // up to 8px blur
  const darkAlpha = 0.55 * overlayOpacity // overlay darkness
  const cardOpacity = Math.min(1, Math.max(0, (overlayProgress - 0.06) * 1.25)) // card appears a bit later
  const cardTranslate = 30 * (1 - cardOpacity) // translate up as it appears

  // overlay should be interactive only when visible and not closed
  const overlayInteractive = !overlayClosed && overlayProgress > 0.02

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
          // if overlay is visible enough and not closed, allow click to jump; otherwise ignore
          if (overlayInteractive) handleOverlayClick()
        }}
        style={{
          // pointer events only when overlay visible enough and not closed
          pointerEvents: overlayInteractive ? "auto" : "none",
          transition: "background-color 160ms linear, backdrop-filter 160ms linear",
          backgroundColor: `rgba(2,6,11, ${darkAlpha})`,
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      >
        {/* Info card */}
        <div
          className="max-w-3xl w-[calc(100%-3rem)] sm:w-[760px] p-6 rounded-2xl border border-neon-cyan/200 bg-gradient-to-br from-deep-night/60 to-deep-night/80 shadow-lg text-left relative top-2"
          style={{
            transform: `translateY(${cardTranslate}px)`,
            opacity: cardOpacity,
            transition: "transform 280ms cubic-bezier(.2,.9,.2,1), opacity 240ms ease-out",
            zIndex: 41,
            cursor: overlayInteractive ? "pointer" : "default",
          }}
          onClick={(e) => {
            // prevent bubbling overlay click twice
            e.stopPropagation()
            if (overlayInteractive) handleOverlayClick()
          }}
        >
          {/* CLOSE BUTTON (top-right inside card) */}
          <button
            aria-label="Close about overlay"
            onClick={handleCloseOverlay}
            className="absolute right-3 top-3 w-8 h-8 rounded-md bg-deep-night/50 border border-neon-cyan/10 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/6 focus:outline-none focus:ring-2 focus:ring-neon-cyan/30"
            title="Close"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2 className="text-3xl sm:text-4xl font-rajdhani text-neon-cyan font-bold mb-2 font-serif">About ITRONIX</h2>
          {/* <p className="text-sm text-muted-text mb-3">
            ITRONIX — <span className="font-semibold text-neon-cyan">TECHLAND</span> is a futuristic virtual world where technology comes to life.
            Robots, AI, networks and holographic experiences come together to create an immersive IT universe. Explore workshops, competitions and
            live demonstrations.
          </p> */}

            <div className="text-sm text-muted-text mb-3 space-y-4 leading-relaxed ">
            <p>
                <strong>ITRONIX</strong> is the annual technical fest of the <strong>Information Technology Department</strong>, celebrating innovation, creativity, and technical excellence. Inspired by the futuristic theme <strong>TECHLAND</strong>, the fest is crafted as a virtual world where technology truly comes to life.
              </p>

              {/* <p>
                <strong>TECHLAND</strong> represents an immersive IT universe filled with <strong>AI systems, robotics, computers, network signals,</strong> and dynamic digital environments. Every element reflects the power of innovation, seamless connectivity, and digital intelligence—making participants feel as if they have stepped into the future of technology itself.
              </p> */}

              
                Through a vibrant mix of <strong>Technical competitions,
                 Non-Technical challenges, Gaming events, Workshops,</strong> 
                 and interactive experiences, <strong>ITRONIX</strong> provides a platform
                  for students to learn, compete, collaborate, and showcase their skills.
                   {/* while exploring the limitless possibilities of the tech-driven world. */}
              
              </div>

          {/* <div className="flex justify-center flex-wrap gap-3 mt-2">
            <div className="px-3 py-2 rounded-md border border-neon-cyan/20 bg-[rgba(4,8,12,0.36)] text-neon-cyan text-xs">23 — 24 Jan 2026</div><br/>
          </div> */}

          <div className="flex justify-center  mt-5 flex gap-3">
            {/* <div  className="inline-block btn-secondary px-4 py-2 pointer-events-auto">
              23 — 24 Jan 2026
            </div> */}

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
              bg-gradient-to-r from-[#06F7FF]  to-[#00C2FF]
              bg-clip-text text-transparent
              drop-shadow-[0_8px_30px_rgba(0,200,255,0.18)]
              ring-1 ring-[#00d4ff]/10 rounded-md
              before:content-[''] before:absolute before:-inset-2 before:-z-10
              before:rounded-lg before:blur-[24px] before:opacity-60
              before:bg-gradient-to-r before:from-[#00121a]/60 before:via-transparent before:to-[#002233]/60
              transition-all duration-300
              whitespace-nowrap sm:whitespace-normal
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1s ease-out",
              WebkitTextStroke: "0.9px rgba(0,200,255,0.22)", // subtle cyan outline for separation
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
          <span className="text-neon-cyan text-1xl sm:text-4xl lg:text-3xl font-serif font-bold ">
            Techland
          </span>
          <br />
          <span className="text-neon-cyan italic text-sm sm:text-base lg:text-lg font-semibold ">
            where only the skilled survives
          </span>
        </p>

        <p className="text-sm sm:text-base font-serif text-muted-text mb-8 sm:mb-12 ">
          Information Technology Department festival
          <br />
          on 23 & 24 Jan 2026
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-xs sm:text-sm font-serif text-neon-cyan ">
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
          <p className="btn-primary block text-center text-xs py-2 mt-2 sm:mt-0 pointer-events-auto font-poppins">
  Registrations Open <br /> from 5th January
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

      {/* ================= FLOATING AI LAUNCHER (ITRONIX style) ================= */}
      {/* small, neon glass button bottom-right that opens the AI chat page (/ai) */}
      {/* <div className="absolute top-120 z-50 right-4 bottom-6 sm:right-8 sm:bottom-8 pointer-events-auto">
        <Link href="/ai" aria-label="Ask ITRONIX AI" className="group">
          <div className="flex items-center gap-2 bg-gradient-to-br from-deep-night/70 to-deep-night/80 border border-neon-cyan/20 rounded-full px-3 py-2 shadow-[0_8px_30px_rgba(0,200,255,0.08)] hover:shadow-[0_12px_40px_rgba(0,200,255,0.14)] transition-all">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#001219] to-[#002233] border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              chat icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-poppins text-muted-text group-hover:text-neon-cyan transition">Ask ITRONIX AI</span>
              <span className="text-[11px] text-neon-cyan font-rajdhani tracking-wide">Fest assistant</span>
            </div>

            small badge for mobile (only icon visible)
            <div className="sm:hidden ml-0">
              <span className="sr-only">Open AI chat</span>
            </div>
          </div>
        </Link>
      </div> */}

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

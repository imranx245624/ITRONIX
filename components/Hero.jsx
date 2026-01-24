"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import "./hero.css"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Color } from "three/src/Three.Core.js"

export default function Hero() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // overlay progress from 0 to 1 (0 = no overlay, 1 = fully visible)
  const [overlayProgress, setOverlayProgress] = useState(0)
  // if user manually closed the info card, keep it closed until they return to top
  const [overlayClosed, setOverlayClosed] = useState(false)

  // NEW: popup state for TechSlides Arena
  const [showPptPopup, setShowPptPopup] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // show PPT popup after 2s
  useEffect(() => {
    const t = setTimeout(() => {
      setShowPptPopup(true)
    }, 2000)
    return () => clearTimeout(t)
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

  // TechSlides topics (exact as you provided)
  const techSlidesTopics = [
    "Green IT & Sustainability",
    "Use of Data Analytics in Business Growth",
    "Cyber Safety & Ethical Hacking",
    "Digital India & Smart Technology",
    "Significance of Prompt Engineering",
    "Scrolling culture and it's impact on focus",
    "Maipulated Reality: the Deepfake Era"
  ]

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-0 sm:pt-20 bg-deep-night"
    >
      {/* BACKGROUND IMAGE */}
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

      {/* STATIC GRADIENT OVERLAY (visual only) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-deep-night/70 via-deep-night/50 to-deep-night/70 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* DYNAMIC BLUR + INFO OVERLAY */}
       <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        aria-hidden="true"
        onClick={() => {
          if (overlayInteractive) handleOverlayClick()
        }}
        style={{
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

          <div className="text-sm text-muted-text mb-3 space-y-4 leading-relaxed ">
            <p>
              <strong>ITRONIX</strong> is the annual technical fest of the <strong>Information Technology Department</strong>, celebrating innovation, creativity, and technical excellence.
            </p>
              
            <p>
              Through a vibrant mix of <strong>Technical competitions, Non-Technical challenges, Gaming events, Workshops</strong> and interactive experiences, <strong>ITRONIX</strong> provides a platform for students to learn, compete, collaborate, and showcase their skills.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <div>
              {/* <Link href="/register" className="w-full text-center btn-secondary hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 block px-4 py-2 rounded-lg font-semibold">
                Register now
              </Link> */}
          </div>
        </div>
        </div> 
       </div> 

      {/* ================= MAIN CONTENT (make clickable by NOT using pointer-events-none on this container) ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-14 sm:mt-0">
        {/* TITLE */}
        <div className="mb-4 sm:mb-6">
          <h1
            className={`relative text-3xl sm:text-4xl lg:text-7xl
              font-serif font-bold tracking-tight sm:tracking-[0.25em]
              bg-gradient-to-r from-[#06F7FF]  to-[#00C2FF]
              bg-clip-text text-transparent
              drop-shadow-[0_8px_30px_rgba(0,200,255,0.18)]
              ring-1 ring-[#00d4ff]/10 rounded-md
              transition-all duration-300
              whitespace-nowrap sm:whitespace-normal
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1s ease-out",
              WebkitTextStroke: "0.9px rgba(0,200,255,0.22)",
            }}
          >
            I T R O N I X
            <span
              className="ml-4 align-middle text-sm sm:text-base lg:text-lg px-3 py-1 rounded-full border border-neon-cyan/40 text-neon-cyan tracking-widest font-semibold backdrop-blur-sm bg-[rgba(4,8,12,0.36)]"
            >
              2026
            </span>
          </h1>
        </div>

        {/* SUBTITLE */}
        <p className="text-lg sm:text-xl lg:text-2xl font-poppins text-holo-pale mb-2 sm:mb-4">
          <span className="text-neon-cyan font-serif font-bold">Techland</span>
          <br />
          <span className="text-neon-cyan italic text-sm sm:text-base lg:text-lg font-semibold">where only the skilled survives</span>
        </p>

        <p className="text-sm sm:text-base font-serif text-muted-text mb-8 sm:mb-12 ">
          Information Technology Department festival
          <br />
          on 23 Jan 2026
        </p>

        {/* CTA: No ancestor has pointer-events:none so children are clickable */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <div>
  {/* <Link
    href=""
    className="w-full text-center px-4 py-2 rounded-lg font-semibold text-black
               bg-gradient-to-r from-[#06F7FF] via-[#00C2FF] to-[#06F7FF]
               shadow-[0_14px_40px_rgba(6,247,255,0.14)] block
               transform-gpu will-change-transform
               animate-[pulseScale_1s_ease-in-out_infinite_alternate]"
    aria-label="Register"
  >
    REGISTER End NOW please regsiter tomorrow till 9AM 
  </Link> */}
  {/* <p className="w-full text-center px-4 py-2 rounded-lg font-semibold text-black
               bg-gradient-to-r from-[#06F7FF] via-[#00C2FF] to-[#06F7FF]
               shadow-[0_14px_40px_rgba(6,247,255,0.14)] block
               transform-gpu will-change-transform
               animate-[pulseScale_1s_ease-in-out_infinite_alternate]" >REGISTER NOW </p> */}

  {/* registration notice under register button */}
  {/* <p className="mt-3 text-xs sm:text-sm  font-medium" style={{
    color: "red",
    fontWeight: "bold",
  }}>Registrations closed!  NOw  reggister offline till tomorrow 9 AM</p> */}

  {/* inline styles in same component (not a separate file) */}
  <style jsx>{`
    @keyframes pulseScale {
      from { transform: scale(1); }
      to   { transform: scale(1.3); }
    }

    /* Fallback for environments where Tailwind's arbitrary animation token might not pick up:
       we ensure the element with our class also has the animation applied via attribute selector. */
    :global(.animate-[pulseScale_1s_ease-in-out_infinite_alternate]) {
      animation-name: pulseScale;
      animation-duration: 1s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    /* Respect user's reduced motion setting */
    @media (prefers-reduced-motion: reduce) {
      :global(.animate-[pulseScale_1s_ease-in-out_infinite_alternate]) {
        animation: none !important;
        transform: none !important;
      }
    }
  `}</style>

          </div>
</div>

          <Link
            href="/events"
            className="btn-secondary text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 transform-gpu hover:-translate-y-1 hover:scale-110 hover:rotate-1 hover:shadow-lg hover:shadow-neon-cyan/50 mt-6 inline-block"
          style={{

  textTransform: "none",
  letterSpacing: "normal",
}}
>
            Explore Event Details
          </Link>

          {/* SCHEDULE BUTTON + Brochure download
              Behavior:
               - DOM order: Schedule (first) then Brochure (second)
               - On mobile (default): Brochure is positioned absolute bottom-left of hero (so it's visually at left bottom)
               - On md+ (desktop): layout becomes static and flex-row-reverse so Brochure appears to the left of Schedule (close by)
               - Place brochure file in the public folder (e.g. public/Brochure-Itronix.pdf)
          */}
         <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
  <a
    href="/Brochure-Itronix.pdf"
    download
    aria-label="Download brochure"
    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neon-cyan text-black font-semibold text-sm hover:shadow-lg"
  >
    <span className="text-lg" aria-hidden>📥</span>
    <span>Brochure</span>
  </a>

  <Link
    href="/events#section-schedule"
    className="inline-block text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-md border border-neon-cyan/30 backdrop-blur-sm bg-[rgba(4,8,12,0.36)] hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-200"
    aria-label="Go to schedule"
  >
    Schedule
  </Link>
</div>

        
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce flex flex-col items-center gap-2 text-neon-cyan/70">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* TechSlides popup (appears 2s after load) */}
      {/* {showPptPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
        >
          backdrop
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowPptPopup(false)}
            aria-hidden="true"
          />

          <div className="relative z-70 w-full max-w-lg mx-auto rounded-xl">
            <div className="bg-[#041014]/98 rounded-lg overflow-hidden border-2 border-cyber-orange/100 p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-neon-cyan">TechSlides Arena — Topics Revealed</h3>
                <button
                  onClick={() => setShowPptPopup(false)}
                  aria-label="Close topics popup"
                  className="ml-3 w-8 h-8 rounded-md bg-deep-night/40 border border-neon-cyan/10 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/6 focus:outline-none"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 text-sm text-muted-text">
                <p className="mb-2">Topics for Tech Slide Arena (Presentation):</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {techSlidesTopics.map((t, i) => (
                    <li key={i} className="text-white">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowPptPopup(false)}
                  className="px-3 py-1 rounded-md bg-neon-cyan text-black font-semibold"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </section>
  )
}

"use client"

import './hero.css'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { initCanvasAnimation } from '@/utils/canvas-animation'

export default function Hero() {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const cleanup = initCanvasAnimation(canvasRef.current)
    return cleanup
  }, [])

  const titleClass =
  `text-4xl sm:text-5xl lg:text-7xl font-rajdhani font-bold uppercase tracking-wider
   bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] via-[#7CFFB2] to-[#FF2D95]
   drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-all duration-200`;

  return (

    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-0 sm:pt-20 bg-deep-night"
      /* changed: reduced mobile top padding (pt-6) while keeping sm:pt-20 for larger screens */
    >
      <br/><br/><br/><br/>  
      {/* Background image */}
      <img
        ref={imageRef}
        src="/images/bg1.png"
        alt="College campus"
        className="absolute inset-0 w-full h-full object-cover filter saturate-150 contrast-125 brightness-90"
        style={{
          filter: 'saturate(1.5) contrast(1.25) brightness(0.6) blur(1px)',
          willChange: 'transform',
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-deep-night/70 via-deep-night/50 to-deep-night/70 pointer-events-none" />

      {/* Animated canvas */}
      {/* <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" /> */}
        {/* <br/><br/><br/><br/> */}

      {/* === Sponsor Box (top-left on desktop, centered-top on mobile) === */}


      {/* Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-14 sm:mt-0">
        {/* changed: added -mt-8 on mobile only so content shifts upward on small screens */}

        {/* Main Title with Animation */}
        <div
          className="z-30 top-500 mb-4 sm:mb-6"
          aria-hidden={false}
        >
          <a
            href="#"
            className="group block w-40 h-20 sm:w-45 sm:h-25 rounded-xl backdrop-blur-sm bg-[rgba(4,8,12,0.36)] border border-[rgba(6,182,212,0.16)] shadow-neon/ flex items-center justify-center p-2 border border-neon-cyan/100 rounded-full"
            title="Main Sponsor"
            aria-label="Main Sponsor"
          >
            {/* Replace below <div> with an <img src="/path/to/logo.png" alt="Sponsor"/> when you have the logo */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center" >
                <div className="text-xs sm:text-sm font-poppins text-neon-cyan/95 uppercase tracking-wider ">
                  Platinum Sponsor
                </div>
                <div className="mt-1 text-[10px] sm:text-xs text-muted-text">ITRONIX Partner1</div>
              </div>
            </div>
          </a>
        </div>

        <div className="mb-4 sm:mb-6">
          <h1
            id="hero-title"
            className={` text-4xl sm:text-5xl lg:text-7xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan text-glow transition-all duration-200 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 1s ease-out',
            }}
          >
            I T R Φ N ! X   <span className='text-2xl sm:text-1xl lg:text-1xl'>2026</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl font-poppins text-holo-pale mb-1 sm:mb-2 animate-shimmer"></p>

        {/* Date and Location */}
        <p className="text-sm sm:text-base font-poppins text-muted-text mb-6 sm:mb-8">
           <span className={"text-neon-cyan"} >Techland : where only the skilled survives</span><br/>Information Technology Department festival<br/>on 23 & 24 jan 2026  
        </p>

        {/* Event Highlights */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-xs sm:text-sm font-poppins text-neon-cyan ">
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Hackathon</span>
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Web Dev </span>
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Vibe Coding</span>
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Debugging</span>
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Creativity</span>
          <span className="px-2 sm:px-3 py-1 border border-neon-cyan/30 rounded-full backdrop-blur-sm bg-[rgba(4,8,12,0.36)]">Gaming</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <p className="btn-primary block text-center text-xs py-2 mt-2"  >Registration Start <br/>From 1st January  </p> 

          <Link
            href="/events"
            className="btn-secondary transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/50 text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 transition-transform duration-200 ease-out transform-gpu  hover:-translate-y-1 hover:scale-110 hover:rotate-1"
          >
            See Events
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

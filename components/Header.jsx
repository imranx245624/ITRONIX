"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // close on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isMobileMenuOpen])

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Workshops", href: "/workshops" },
    { name: "Sponsors", href: "/sponsors" },
  ]

  const toggleMenu = useCallback(() => setIsMobileMenuOpen((s) => !s), [])
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  useEffect(() => {
    // REMOVABLE debug
    console.log("mobile-menu-open", isMobileMenuOpen)
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-deep-night/95 backdrop-blur-md border-b border-neon-cyan/10" : "bg-transparent"
      }`}
    >
      <nav className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Left: logo + full college name (visible on all screen sizes) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <img
            src="/images/Clg_logo.png"
            alt="college logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full flex-shrink-0"
          />
          <Link href="/" className="flex flex-col leading-tight min-w-0">
            {/* allow wrapping on mobile so full name is visible */}
             <span className="text-[9px] sm:text-[10px] md:text-[12px] font-poppins text-muted-text uppercase whitespace-normal">
              
                Guru Nanak Vidyak Society's
    
            </span>
            <span className="text-[11px] sm:text-[12px] md:text-[14px] font-rajdhani font-bold uppercase text-neon-cyan text-glow tracking-widest whitespace-normal">
              Guru Nanak College of Arts, Science & Commerce (AUTONOMOUS)
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[12px] font-poppins text-muted-text uppercase whitespace-normal">

                G.T.B. Nagar, Mumbai - 400037
                NAAC ACCREDITED 'A*' CGPA 3.35
            </span>
          </Link>
        </div>

        {/* Center: absolute centered nav (desktop only) */}
        {/* <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3 py-1 text-xs uppercase tracking-wider font-poppins text-muted-text transition-transform duration-200 ease-out transform-gpu hover:text-neon-cyan hover:-translate-y-1 hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </div> */}

        {/* Right: CTA / hamburger */}
        <div className="ml-auto flex items-center gap-2">
          {/* Placeholder for possible CTA on desktop */}
          <div className="hidden md:block">{/* optional CTA here */}</div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-neon-cyan hover:text-holo-pale transition-colors p-2"
          >
            {!isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile full-screen overlay + menu panel below header */}
        {isMobileMenuOpen && (
          <>
            {/* overlay */}
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* panel wrapper positioned below header and safe-area aware */}
            <div
              style={{
                top: "calc(var(--header-height, 5rem) + env(safe-area-inset-top, 0px))",
                maxHeight: "calc(100vh - var(--header-height, 5rem) - env(safe-area-inset-top, 0px))",
              }}
              className="fixed left-0 right-0 z-[60] overflow-y-auto flex justify-center px-4 pb-6"
            >
              <div
                id="mobile-menu"
                className="w-full max-w-sm bg-deep-night/95 backdrop-blur-md rounded-2xl py-4 px-4 sm:py-6 sm:px-6 text-center transition-transform duration-200 transform translate-y-0 max-h-full overflow-hidden"
                role="dialog"
                aria-modal="true"
              >
                {/* inner scroll area so first item never gets clipped by rounded corner */}
                <div className="max-h-full overflow-y-auto px-1 pt-2">
                  <nav className="flex flex-col gap-2 sm:gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={closeMenu}
                        className="block text-lg uppercase font-rajdhani text-muted-text hover:text-neon-cyan transition-transform duration-200 hover:-translate-y-1 hover:scale-105 py-4"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  {/* optional registration CTA */}
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <button
                      onClick={closeMenu}
                      className="btn-primary inline-block text-xs py-2 px-6 text-center"
                    >
                      Registration Start <br />From 1st January
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}

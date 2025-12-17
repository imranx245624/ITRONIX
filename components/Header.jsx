// components/Header.jsx
"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e) => { if (e.key === "Escape") setIsMobileMenuOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isMobileMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Workshops", href: "/workshops" },
    { name: "Sponsors", href: "/sponsors" },
  ]

  const toggleMenu = useCallback(() => setIsMobileMenuOpen((s) => !s), [])
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[var(--header-height,6rem)] z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-deep-night/95 backdrop-blur-md border-b border-neon-cyan/10" : "bg-transparent"
      }`}
    >
      <nav className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Left: logo + college name */}
        <div className="
        flex items-center justify-center h-full gap-3 flex-shrink-0 ">
          <div className="flex items-center justify-center gap-3">
            {/* <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-deep-night/60 border border-neon-cyan/10 overflow-hidden">
              <img src="/images/Clg_logo.png" alt="college logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
            </div> */}
          <div className="flex items-center justify-center">
  <div className="flex items-center gap-3">
   <img
  src="/images/Clg_logo.png"
  alt="college logo"
  className="w-15 h-15 md:w-30 md:h-30 object-contain"
/>


    <Link href="/" className="flex flex-col leading-tight min-w-0 text-center">
      <span className="text-[7px] md:text-[7px] font-poppins text-muted-text uppercase whitespace-normal">
        Guru Nanak Vidyak Society’s
      </span>
                
      <span className="text-[11px] md:text-[17px] font-rajdhani font-bold uppercase text-neon-cyan text-glow tracking-wider whitespace-nowrap md:whitespace-normal">
        GURU NANAK COLLEGE
      </span>

      <span className="text-[9px] md:text-[7px] font-poppins text-muted-text uppercase whitespace-normal">
        of Arts, Science & Commerce<br/>(AUTONOMOUS)<br/>G.T.B. Nagar, Mumbai- 400037 <br/>
        NAAC Accredited ‘A+’ CGPA 3.35
      </span>
    </Link>
  </div>
</div>

          </div>
        </div>

        {/* Center nav (desktop only) */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3 py-1 text-xs uppercase tracking-wider font-poppins text-muted-text transition-transform duration-200 ease-out transform-gpu hover:text-neon-cyan hover:-translate-y-1 hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop: sign-in or dashboard */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              {/* Removed redirectUrl prop to avoid DOM warning */}
              <SignInButton mode="modal">
                {/* SignInButton will render an accessible button; we can pass className directly */}
                <button className="btn-secondary transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/50 text-center text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 transition-transform duration-200 ease-out transform-gpu hover:-translate-y-1 hover:scale-110 hover:rotate-1">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/Dashboard" className="btn-secondary">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile: show sign-in or user button */}
          <div className="md:hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="p-2 rounded-md bg-deep-night/40 border border-neon-cyan/10 text-neon-cyan hover:bg-deep-night/70 transition-colors"
                  aria-label="Sign in"
                >
                  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m12 0l-4-4m4 4l-4 4M21 12v6a2 2 0 01-2 2H7" />
                  </svg>
                  <span className="align-middle text-sm">Sign in</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile menu panel (if used) */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300" onClick={closeMenu} aria-hidden="true" />
            <div
              style={{
                top: "calc(var(--header-height, 4rem) + env(safe-area-inset-top, 0px))",
                maxHeight: "calc(100vh - var(--header-height, 4rem) - env(safe-area-inset-top, 0px))",
              }}
              className="fixed left-0 right-0 z-[60] overflow-y-auto flex justify-center px-4 pb-6"
            >
              <div id="mobile-menu" className="w-full max-w-sm bg-deep-night/95 backdrop-blur-md rounded-2xl py-4 px-4 sm:py-6 sm:px-6 text-center transition-transform duration-200 transform translate-y-0 max-h-full overflow-hidden" role="dialog" aria-modal="true">
                <div className="max-h-full overflow-y-auto px-1 pt-2">
                  <nav className="flex flex-col gap-2 sm:gap-4">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href} onClick={closeMenu} className="block text-lg uppercase font-rajdhani text-muted-text hover:text-neon-cyan transition-transform duration-200 hover:-translate-y-1 hover:scale-105 py-4">
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <button onClick={closeMenu} className="btn-primary inline-block text-xs py-2 px-6 text-center">
                      Registration Start <br /> From 1st January
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

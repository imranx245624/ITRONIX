"use client"

import { useState, useEffect } from "react"
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Workshops", href: "/workshops" },
    { name: "Sponsors", href: "/sponsors" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-deep-night/95 backdrop-blur-md border-b border-neon-cyan/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <span> 
            <img src="/images/Clg_logo.png"
            alt="user" className="w-25 h-25 md:w-25 md:h-25 object-contain rounded-full"
            />
          </span>
          <Link href="/" className="flex flex-col ">
          
            <span className=" text-[20px] text-xs font-poppins text-muted-text tracking-widest font-rajdhani font-bold uppercase text-neon-cyan text-glow">Guru Nanak College <br/> of Arts, Science & Commerce</span>
            {/* <span className="text-lg sm:text-xl font-rajdhani font-bold uppercase text-neon-cyan text-glow">
              I T R Φ N ! X — 3.O
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-poppins text-xs sm:text-sm uppercase tracking-wider text-muted-text transition-transform duration-200 ease-out transform-gpu hover:text-neon-cyan hover:-translate-y-1 hover:scale-110 hover:rotate-1"

              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <Link href="/register" className="btn-primary hidden sm:block text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3">
              Register
            </Link> */}
            {/* <p className="text-[12px] text-neon-cyan px-2 sm:px-3 py-1 border border-neon-cyan/500 w-70 h-8 backdrop-blur-sm bg-[rgba(4,8,12,0.36)]"  >Registration Start From 1st January  </p>          Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-neon-cyan hover:text-holo-pale transition-colors p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-neon-cyan/10 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block font-poppins text-xs uppercase tracking-wider text-muted-text hover:text-neon-cyan transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/register"
              className="btn-primary block text-center text-xs py-2 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

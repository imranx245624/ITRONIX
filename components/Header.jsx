"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = (usePathname() || "").toLowerCase()

  /* 🔥 IMPORTANT: Hide header completely on /ai page */
  if (pathname.startsWith("/ai")) {
    return null
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isMobileMenuOpen])

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

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((s) => !s)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[var(--header-height,6rem)] z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-deep-night/90 backdrop-blur-md border-b border-neon-cyan/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/images/Clg_logo.png"
            alt="college logo"
            className="w-10 h-15 md:w-30 md:h-30 object-contain"
          />

          <Link href="/" className="flex flex-col leading-tight min-w-0 text-center">
            <span className="text-[7px] font-poppins text-muted-text uppercase">
              Guru Nanak Vidyak Society’s
            </span>

            <span className="text-[11px] md:text-[17px] font-rajdhani font-bold uppercase text-neon-cyan tracking-wider">
              GURU NANAK COLLEGE
            </span>

            <span className="text-[9px] font-poppins text-muted-text uppercase">
              of Arts, Science & Commerce
              <br />(AUTONOMOUS)
              <br />G.T.B. Nagar, Mumbai- 400037
              <br />NAAC Accredited ‘A+’ CGPA 3.35
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3 py-1 text-xs uppercase tracking-wider text-muted-text hover:text-neon-cyan transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-secondary text-xs px-5 py-2">
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

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="p-2 rounded-md bg-deep-night/40 border border-neon-cyan/10 text-neon-cyan text-sm">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/Dashboard"
                className="p-2 rounded-md bg-deep-night/30 border border-neon-cyan/10 text-neon-cyan text-sm"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  )
}

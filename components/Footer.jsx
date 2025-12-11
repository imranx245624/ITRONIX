"use client"

import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-night/80 backdrop-blur-sm border-t border-neon-cyan/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-rajdhani font-bold uppercase text-neon-cyan mb-2">I T R Φ N ! X — 3.O</h3>
            <p className="font-poppins text-sm text-muted-text">Beyond Tomorrow</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-neon-cyan mb-4 text-sm uppercase">Events</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  All Events
                </Link>
              </li>
              <li>
                <Link
                  href="/workshops"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-poppins font-semibold text-neon-cyan mb-4 text-sm uppercase">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-poppins font-semibold text-neon-cyan mb-4 text-sm uppercase">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="mailto:itronix@gurunanak.edu.in"
                  className="font-poppins text-sm text-muted-text hover:text-neon-cyan transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neon-cyan/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-poppins text-sm text-muted-text text-center md:text-left">
              © {currentYear} ITRONIX-2K26 — Guru Nanak College of Arts, Science & Commerce, GTB Nagar, Mumbai(400037).
            </p>
            <p className="font-poppins text-xs text-muted-text/60">Built by IMRAN Ali</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

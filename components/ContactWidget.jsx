// components/ContactWidget.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"

export default function ContactWidget() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // Close popover when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("click", onDoc)
    return () => document.removeEventListener("click", onDoc)
  }, [])

  // Links (as requested)
  const INSTAGRAM = "https://instagram.com/gnc_itronix"
  const WHATSAPP = "https://wa.me/+919905956912" // uses number you provided
  const EMAIL = "mailto:Itronix@gncasc.org"

  return (
    <div ref={containerRef}>
      {/* Floating container: left-bottom on desktop, center-bottom on mobile */}
      <div
        className="fixed z-[99999] left-6 bottom-25 sm:left-6 sm:bottom-6 md:left-6 md:bottom-6"
        style={{ pointerEvents: "auto" }}
      >
        {/* Button */}
        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label="Contact us"
            title="Contact us"
            className="group flex items-center gap-3 rounded-full px-3 py-2 bg-gradient-to-br from-deep-night/85 to-deep-night/80 border border-neon-cyan/10 shadow-md focus:outline-none"
            style={{
              minWidth: 48,
              minHeight: 48,
            }}
          >
            {/* Icon */}
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg,#001219,#002233)",
                border: "1px solid rgba(0,200,255,0.12)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
                <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10l4-2h10a2 2 0 0 0 2-2v-1" />
              </svg>
            </span>

            {/* Hover label (desktop) - shows on hover via group-hover */}
            <span
              className="hidden sm:inline-block text-neon-cyan font-medium px-3 py-1 rounded-full transition-opacity duration-150 opacity-0 group-hover:opacity-100 select-none"
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(0,200,255,0.06)",
                backdropFilter: "blur(6px)",
              }}
            >
              Contact Us
            </span>
          </button>

          {/* Popover: appears above the button (touch-friendly) */}
          <div
            className={`absolute bottom-full mb-3 left-0 transform origin-bottom-left transition-all duration-150 ${
              open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{ zIndex: 100000 }}
          >
            <div
              className="rounded-xl p-3 bg-[#04121a] border border-neon-cyan/12 shadow-lg"
              style={{ minWidth: 200 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-neon-cyan">Contact</div>
                  <div className="text-xs text-muted-text">Reach us on</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close contact menu"
                  className="p-1 rounded-md hover:bg-white/2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted-text">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-md hover:bg-neon-cyan/6 transition text-center"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f09433,#e6683c)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-text">Instagram</div>
                </a>

                {/* WhatsApp */}
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-md hover:bg-neon-cyan/6 transition text-center"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M20.5 3.5a11 11 0 1 0-16 14L3 21l3.7-1.1A11 11 0 0 0 20.5 3.5zM17 14.2c-.3.8-1.5 1.5-1.8 1.6-.4.1-.7.2-1.1 0-.3-.1-1-.3-2.3-.8-1.6-.7-2.6-1.7-3-2.3-.3-.5 0-.7.1-.9.1-.2.2-.4.2-.7 0-.3-.6-1.3-.8-1.8-.2-.5-.4-.4-.8-.3-.4.1-1.1.5-1.6 1.1-.5.6-.6 1.3-.3 2.1.4.8 1.4 2.1 3 3.5 1.6 1.4 3.4 1.9 4.7 2 1.2.1 2.1-.3 2.6-.6.5-.3.9-.8 1.1-1.1.2-.3.2-.6.1-.8-.1-.2-.8-.3-1.2-.5z" />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-text">WhatsApp</div>
                </a>

                {/* Email */}
                <a
                  href={EMAIL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 px-2 py-2 rounded-md hover:bg-neon-cyan/6 transition text-center"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(180deg,#3a3a3a,#222)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v.5l-9 5.5-9-5.5V7zM3 9.7V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.7l-9 5.5-9-5.5z" />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-text">Email</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

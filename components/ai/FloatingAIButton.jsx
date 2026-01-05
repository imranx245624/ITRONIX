// components/ai/FloatingAIButton.jsx
"use client"

import React, { useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function FloatingAIButton() {
  const pathname = (usePathname() || "").toLowerCase()
  const router = useRouter()

  // hide on /ai routes
  if (pathname.startsWith("/ai")) return null

  const neonShadow = "0 10px 30px rgba(0,200,255,0.08), 0 0 20px rgba(0,200,255,0.04) inset"

  // touch handling for mobile swipe
  const touchStartX = useRef(0)
  const touchThreshold = 40 // px to consider a left-swipe

  const onTouchStart = (e) => {
    const t = e.touches?.[0]
    if (!t) return
    touchStartX.current = t.clientX
  }

  const onTouchEnd = (e) => {
    const t = (e.changedTouches && e.changedTouches[0]) || null
    if (!t) return
    const dx = t.clientX - touchStartX.current
    // if user swiped left beyond threshold, open /ai
    if (dx < -touchThreshold) {
      router.push("/ai")
    }
  }

  const onKeyActivate = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      router.push("/ai")
    }
  }

  return (
    <>
      {/* DESKTOP pill (bottom-right) -> unchanged except wrapped in button */}
      <div
        aria-hidden={false}
        className="hidden sm:flex fixed z-[99999] right-6 bottom-6 items-center"
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={() => router.push("/ai")}
          onKeyDown={onKeyActivate}
          aria-label="Open ITRONIX Assistant"
          title="Open ITRONIX Assistant — Fest assistant"
          className="group flex items-center gap-3 rounded-full px-4 py-3 md:px-5 md:py-3 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60"
          style={{
            background: "linear-gradient(180deg, rgba(6,12,14,0.92), rgba(4,8,10,0.86))",
            border: "1px solid rgba(0,200,255,0.12)",
            boxShadow: neonShadow,
            WebkitTapHighlightColor: "transparent",
            minWidth: 56,
            maxWidth: 340,
          }}
        >
          <div
            className="flex-shrink-0 inline-flex items-center justify-center rounded-full"
            style={{
              width: 46,
              height: 46,
              background: "linear-gradient(135deg,#001219,#002233)",
              border: "1px solid rgba(0,200,255,0.18)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.6)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
              <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <div className="flex flex-col items-start leading-tight select-none">
            <span className="text-sm font-rajdhani font-semibold text-neon-cyan transition-colors group-hover:text-white">
              Ask ITRONIX AI
            </span>
            <span className="text-[11px] text-muted-text">Fest assistant</span>
          </div>
        </button>
      </div>

      {/* MOBILE right-edge tab (smaller + unique styling) */}
      <div
        className="sm:hidden fixed z-[99999] right-0 top-1/2 transform -translate-y-1/2 flex items-center"
        style={{ padding: 6, pointerEvents: "auto" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          role="button"
          tabIndex={0}
          onClick={() => router.push("/ai")}
          onKeyDown={onKeyActivate}
          aria-label="Open ITRONIX Assistant"
          title="Open ITRONIX Assistant"
          className="flex items-center justify-center rounded-l-full p-1 transition-transform duration-150"
          style={{
            width: 36,            // ← smaller width
            height: 150,          // ← slightly reduced height
            borderTopLeftRadius: 9999,
            borderBottomLeftRadius: 9999,
            border: "1px solid rgba(0,200,255,0.06)",
            background: "linear-gradient(180deg, rgba(7,14,16,0.98), rgba(3,6,8,0.9))",
            boxShadow: neonShadow,
          }}
        >
          <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }} className="flex items-center gap-2">
            {/* small icon with a neon dot */}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>

              {/* small pulsating dot to make it unique */}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "rgba(0,255,220,0.95)",
                  boxShadow: "0 0 8px rgba(0,255,220,0.25)",
                  animation: "pulse 1.8s infinite",
                }}
              />
            </span>

            {/* label: tiny uppercase */}
            <span className="text-[11px] font-semibold text-neon-cyan uppercase tracking-wide">ITRONIX AI</span>
          </div>
        </button>
      </div>

      <style jsx>{`
        /* small hover/focus lift for desktop */
        .group:hover { transform: translateY(-3px); }
        .group:focus-within { transform: translateY(-2px); }

        /* pulse animation for mobile dot */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          60% { transform: scale(1.6); opacity: 0.55; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* keep the tab pinned exactly on the right edge for small screens */
        @media (max-width: 640px) {
          div[style*="right: 0"] { right: 0 !important; }
        }
      `}</style>
    </>
  )
}

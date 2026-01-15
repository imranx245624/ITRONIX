// components/ContactWidget.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"

/**
 * ContactWidget (draggable)
 *
 * - Default position: same as before (left bottom on desktop).
 * - User can drag the floating button anywhere (mouse or touch).
 * - Position is saved to localStorage under key 'contactWidgetPos' (so it persists).
 * - Click (tap) still toggles the popover. Dragging does not toggle.
 * - Outside click closes the popover.
 *
 * Note: This file intentionally keeps original links/icons and styling.
 */

export default function ContactWidget() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  // store pixel position if user moved the widget; otherwise null (use default classes)
  const [pos, setPos] = useState(null) // { left: number, top: number } (px) OR null
  const draggingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const movedRef = useRef(false)

  // Links (as requested)
  const INSTAGRAM = "https://instagram.com/gnc_itronix"
  const WHATSAPP = "https://wa.me/+919905956912" // uses number you provided
  const EMAIL = "mailto:Itronix@gncasc.org"

  // load saved pos from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("contactWidgetPos")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed.left === "number" && typeof parsed.top === "number") {
          setPos(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Close popover when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("click", onDoc)
    return () => document.removeEventListener("click", onDoc)
  }, [])

  // helper to save pos
  const savePos = (p) => {
    try {
      localStorage.setItem("contactWidgetPos", JSON.stringify(p))
    } catch {
      // ignore
    }
  }

  // clamp so button stays inside viewport
  const clampPos = (left, top, btnW = 56, btnH = 56, margin = 8) => {
    const winW = typeof window !== "undefined" ? window.innerWidth : 1024
    const winH = typeof window !== "undefined" ? window.innerHeight : 768
    const minLeft = margin
    const minTop = margin
    const maxLeft = Math.max(margin, winW - btnW - margin)
    const maxTop = Math.max(margin, winH - btnH - margin)
    return {
      left: Math.min(Math.max(left, minLeft), maxLeft),
      top: Math.min(Math.max(top, minTop), maxTop),
    }
  }

  // pointer handlers to support drag (mouse + touch)
  useEffect(() => {
    function onPointerMove(e) {
      if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return
      const dx = e.clientX - startRef.current.x
      const dy = e.clientY - startRef.current.y
      const newLeft = startRef.current.left + dx
      const newTop = startRef.current.top + dy

      // if movement > threshold, mark moved (prevents click toggle)
      if (!movedRef.current && Math.hypot(dx, dy) > 6) movedRef.current = true

      const clamped = clampPos(newLeft, newTop)
      setPos(clamped)
    }

    function onPointerUp(e) {
      if (!pointerIdRef.current) return
      if (e.pointerId !== pointerIdRef.current) return
      // end drag
      if (draggingRef.current) {
        draggingRef.current = false
        pointerIdRef.current = null
        // save final pos
        if (pos) savePos(pos)
      }
      // remove capture
      try {
        if (buttonRef.current) buttonRef.current.releasePointerCapture(e.pointerId)
      } catch {}
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
    }
  }, [pos])

  // start dragging on pointerdown
  const onPointerDown = (e) => {
    // only left button / primary pointer
    if (e.button && e.button !== 0) return
    // record pointer id
    pointerIdRef.current = e.pointerId
    draggingRef.current = true
    movedRef.current = false

    const rect = buttonRef.current?.getBoundingClientRect()
    const left = rect ? rect.left : (pos ? pos.left : 24)
    const top = rect ? rect.top : (pos ? pos.top : window.innerHeight - 80) // approximate default top if unknown

    startRef.current = { x: e.clientX, y: e.clientY, left, top }
    // capture pointer so move/up events are delivered to the button even if pointer leaves
    try {
      buttonRef.current?.setPointerCapture(e.pointerId)
    } catch {}
  }

  // handle click: toggle only if not dragged (movedRef false)
  const onButtonClick = (e) => {
    // if we just finished a drag (movedRef true), we shouldn't toggle
    if (movedRef.current) {
      // reset moved flag for next interaction
      movedRef.current = false
      return
    }
    setOpen((s) => !s)
  }

  // reset position to default (optional helper) — not exposed in UI but available for debugging
  // const resetPosition = () => {
  //   localStorage.removeItem("contactWidgetPos")
  //   setPos(null)
  // }

  // compute style: if pos present use left/top fixed; else use original classes (left-bottom)
  const wrapperStyle = pos
    ? {
        position: "fixed",
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        zIndex: 99999,
        pointerEvents: "auto",
      }
    : { pointerEvents: "auto" } // keep default classes for non-moved state

  // default position classes (when pos === null)
  const defaultClass = "fixed z-[99999] left-6 bottom-25 sm:left-6 sm:bottom-6 md:left-6 md:bottom-6"

  return (
    <div ref={containerRef}>
      <div
        // apply class only when pos is null so default placement remains
        className={pos ? "" : defaultClass}
        style={wrapperStyle}
      >
        <div className="relative">
          <button
            ref={buttonRef}
            onPointerDown={onPointerDown}
            onClick={onButtonClick}
            aria-expanded={open}
            aria-label="Contact us"
            title="Contact us"
            className="group flex items-center gap-3 rounded-full px-3 py-2 bg-gradient-to-br from-deep-night/85 to-deep-night/80 border border-neon-cyan/10 shadow-md focus:outline-none"
            style={{
              minWidth: 48,
              minHeight: 48,
              touchAction: "none", // important to allow pointer events for touch drag
              userSelect: "none",
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

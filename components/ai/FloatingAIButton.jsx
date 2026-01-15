"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function FloatingAIButton() {
  const pathname = (usePathname() || "").toLowerCase()
  const router = useRouter()

  if (pathname.startsWith("/ai")) return null

  const neonShadow =
    "0 10px 30px rgba(0,200,255,0.10), inset 0 0 20px rgba(0,200,255,0.06)"

  const DESKTOP_H = 56
  const MOBILE_H = 150
  const STORAGE_KEY = "ai_button_edge_pos"

  const [state, setState] = useState(null)

  const btnRef = useRef(null)
  const dragging = useRef(false)
  const startY = useRef(0)
  const startTop = useRef(0)
  const moved = useRef(false)

  /* ---------------- helpers ---------------- */

  const defaultState = () => {
    const h = window.innerHeight
    const isMobile = window.innerWidth < 640
    return {
      side: "right",
      top: isMobile ? (h - MOBILE_H) / 2 : h - DESKTOP_H - 24,
    }
  }

  const clampTop = (top, height) => {
    const min = 8
    const max = window.innerHeight - height - 8
    return Math.min(Math.max(top, min), max)
  }

  /* ---------------- restore ---------------- */

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (saved) setState(saved)
      else setState(defaultState())
    } catch {
      setState(defaultState())
    }
  }, [])

  useEffect(() => {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  /* ---------------- drag ---------------- */

  const onPointerDown = (e) => {
    dragging.current = true
    moved.current = false
    startY.current = e.clientY
    startTop.current = btnRef.current.getBoundingClientRect().top
    btnRef.current.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    const dy = e.clientY - startY.current
    if (Math.abs(dy) > 4) moved.current = true

    const isMobile = window.innerWidth < 640
    const h = isMobile ? MOBILE_H : DESKTOP_H

    setState((s) => ({
      ...s,
      top: clampTop(startTop.current + dy, h),
    }))
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  /* ---------------- click ---------------- */

  const handleClick = () => {
    if (moved.current) return
    router.push("/ai")
  }

  const toggleSide = () => {
    setState((s) => ({
      ...s,
      side: s.side === "left" ? "right" : "left",
    }))
  }

  if (!state) return null

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  /* ---------------- styles ---------------- */

  const wrapperStyle = {
    position: "fixed",
    top: state.top,
    zIndex: 99999,
    [state.side]: isMobile ? 0 : 24,
  }

  return (
    <>
      <div
        style={wrapperStyle}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* ---------- DESKTOP ---------- */}
        <div className="hidden sm:block">
          <button
            ref={btnRef}
            onPointerDown={onPointerDown}
            onClick={handleClick}
            onDoubleClick={toggleSide}
            className="flex items-center gap-3 rounded-full px-4 py-3 select-none"
            style={{
              height: DESKTOP_H,
              background:
                "linear-gradient(180deg, rgba(6,12,14,0.95), rgba(4,8,10,0.9))",
              border: "1px solid rgba(0,200,255,0.18)",
              boxShadow: neonShadow,
              touchAction: "none",
            }}
          >
            {/* icon */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg,#001219,#002233)",
                border: "1px solid rgba(0,200,255,0.25)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neon-cyan"
              >
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            {/* TEXT IN BOX */}
            <div
              className="px-3 py-1 rounded-md text-sm font-semibold tracking-wide"
              style={{
                background: "rgba(0,200,255,0.08)",
                border: "1px solid rgba(0,200,255,0.35)",
                color: "#6ffcff",
                boxShadow: "inset 0 0 8px rgba(0,200,255,0.15)",
              }}
            >
              ITRONIX AI
            </div>
          </button>
        </div>

        {/* ---------- MOBILE ---------- */}
        <div className="sm:hidden">
          <button
            ref={btnRef}
            onPointerDown={onPointerDown}
            onClick={handleClick}
            onDoubleClick={toggleSide}
            className="rounded-full flex items-center justify-center"
            style={{
              width: 36,
              height: MOBILE_H,
              background:
                "linear-gradient(180deg, rgba(7,14,16,0.98), rgba(3,6,8,0.92))",
              border: "1px solid rgba(0,200,255,0.18)",
              boxShadow: neonShadow,
              touchAction: "none",
            }}
          >
            <div
              style={{
                transform:
                  state.side === "left" ? "rotate(90deg)" : "rotate(-90deg)",
              }}
            >
              {/* TEXT BOX */}
              <div
                className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(0,200,255,0.10)",
                  border: "1px solid rgba(0,200,255,0.4)",
                  color: "#6ffcff",
                  boxShadow: "inset 0 0 6px rgba(0,200,255,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                ITRONIX AI
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

// components/RouteButtons.jsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Minimal icons (keeps bundle small)
function Icon({ name, className = "w-5 h-5" }) {
  if (name === "home")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (name === "events")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 3v4M16 3v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (name === "workshops")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (name === "sponsors")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3v6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16h3v3H7zM14 16h3v3h-3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return null
}

export default function RouteButtons() {
  const pathname = usePathname() || "/"

  const routes = [
    { name: "HOME", href: "/", key: "home", icon: "home" },
    { name: "EVENTS", href: "/events", key: "events", icon: "events" },
    { name: "WORKSHOPS", href: "/workshops", key: "workshops", icon: "workshops" },
    { name: "SPONSORS", href: "/sponsors", key: "sponsors", icon: "sponsors" },
  ]

  return (
    <>
      {/* DESKTOP: left fixed column with logo + two-line name on top, then route buttons */}
      <aside
        className="hidden md:flex fixed left-4 top-80 transform -translate-y-1/2 z-50 flex-col items-left gap-4"
        style={{ width: 220 }}
        aria-hidden={false}
      >
        {/* Brand block */}
        <div className="flex flex-col items-left gap-2 mb-2">
          <Link href="/" className="flex flex-col items-left text-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-neon-cyan/20 flex items-center justify-center bg-deep-night">
              <img src="/images/Clg_logo.png" alt="logo" className="w-11 h-11 object-contain" />
            </div>
            <div className="mt-1 leading-tight">
              {/* <div className="text-xs font-rajdhani font-bold uppercase text-neon-cyan text-glow tracking-wide">
                Guru Nanak
              </div>
              <div className="text-[11px] font-poppins text-muted-text uppercase">
                College 
              </div> */}
            </div>
          </Link>
        </div>


        {/* Vertical nav buttons */}
        <nav className="flex flex-col w-16 gap-3">
          {routes.map((r) => {
            const active = pathname === r.href
            return (
              <Link
                key={r.key}
                href={r.href}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition transform duration-150 ${
                  active
                    ? "bg-neon-cyan text-deep-night shadow-[0_8px_24px_rgba(0,209,193,0.12)]"
                    : "bg-deep-night/70 border border-neon-cyan/15 text-neon-cyan hover:translate-x-1"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-md ${active ? "bg-deep-night/0" : "bg-deep-night/80"}`}>
                  <Icon name={r.icon} className="w-5 h-5" />
                </span>
                {/* <br/> */}
                {/* <span className="text-sm font-semibold tracking-wide">{r.name}</span> */}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* MOBILE: bottom centered compact dock (unchanged behavior) */}
      <div
        className="md:hidden fixed left-1/2 transform -translate-x-1/2 z-50 flex gap-2 items-end px-2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        }}
      >
        <div className="bg-[rgba(4,8,12,0.6)] backdrop-blur-sm rounded-full px-2 py-2 flex gap-2 items-center shadow-lg border border-neon-cyan/10">
          {routes.map((r) => {
            const active = pathname === r.href
            return (
              <Link
                key={r.key}
                href={r.href}
                aria-label={r.name}
                className={`flex flex-col items-center justify-center min-w-[56px] max-w-[72px] px-2 py-1 rounded-full transition-transform duration-150 ${
                  active
                    ? "bg-neon-cyan text-deep-night shadow-[0_6px_18px_rgba(0,209,193,0.12)]"
                    : "bg-transparent text-neon-cyan/90 hover:bg-neon-cyan/10"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${active ? "bg-deep-night/0" : "bg-deep-night/80"}`}
                >
                  <Icon name={r.icon} className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-semibold mt-1 leading-none">{r.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

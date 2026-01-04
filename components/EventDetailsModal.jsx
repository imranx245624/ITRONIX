// components/EventDetailsModal.jsx
"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { eventDetails } from "@/data/eventsDetails" // adjust path if needed

function slugify(title = "") {
  return title
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function EventDetailsModal({ event, onClose }) {
  if (!event) return null
  const slug = slugify(event.title || event.name || "")
  const details = eventDetails[slug] || {}

  // keep latest onClose in a ref so effect can use empty deps
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKey(e) {
      if (e.key === "Escape") {
        onCloseRef.current && onCloseRef.current()
      }
    }

    window.addEventListener("keydown", handleKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", handleKey)
    }
    // EMPTY deps array here: length is constant -> no React warning
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4" role="dialog" aria-modal="true">
      <motion.button
        aria-label="Close modal"
        onClick={() => onCloseRef.current && onCloseRef.current()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        style={{ WebkitTapHighlightColor: "transparent" }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-[980px] mx-auto rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* panel content (unchanged structure) */}
        <div className="relative bg-[#041014]/96 text-white/95 rounded-2xl border-2" style={{ borderColor: "rgba(255,106,0,0.7)" }}>
          <div className="absolute top-3 right-3 z-20">
            <button onClick={() => onCloseRef.current && onCloseRef.current()} className="text-sm px-3 py-1 rounded bg-black/20 hover:opacity-90">
              ✕
            </button>
          </div>

          <div className="event-modal-content max-h-[85vh] overflow-y-auto p-5 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-wider text-neon-cyan mb-2">
                  {details.title || event.title}
                </h2>
                <p className="text-sm text-muted-text/85 mb-4">{details.overview || event.description}</p>

                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <h4 className="text-sm font-bold text-neon-magenta mb-2">Details</h4>
                    <ul className="space-y-1 text-sm text-white/90">
                      <li><strong>Format: </strong>{details.format || "See rules"}</li>
                      <li><strong>Team size: </strong>{details.team_size || event.team_size || "—"}</li>
                      <li><strong>Prize: </strong>{details.prize || event.prize || "—"}</li>
                      <li><strong>Date / Venue: </strong>{details.date || details.venue || "TBD"}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neon-magenta mb-2">Rules & Format</h4>
                    {details.rules ? (
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-white/90">
                        {details.rules.map((r, i) => <li key={i}>{r}</li>)}
                      </ol>
                    ) : <p className="text-sm text-muted-text/80">No extra rules provided.</p>}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neon-magenta mb-2">Judging Criteria</h4>
                    {details.judging ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-white/90">
                        {details.judging.map((j, i) => <li key={i}>{j}</li>)}
                      </ul>
                    ) : <p className="text-sm text-muted-text/80">Judging details not provided.</p>}
                  </div>
                </div>
              </div>

              <aside className="w-full md:w-72 flex-shrink-0">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-neon-magenta mb-2">Contact</h4>
                  {details.contact ? (
                    <div className="bg-black/20 rounded-lg p-3 text-sm space-y-1 border border-black/20">
                      <div className="font-semibold">{details.contact.name}</div>
                      {details.contact.phone && <div className="flex items-center gap-2"><span className="text-neon-cyan/90">📞</span><span>{details.contact.phone}</span></div>}
                      {details.contact.email && <div className="flex items-center gap-2"><span className="text-neon-cyan/90">✉️</span><span>{details.contact.email}</span></div>}
                    </div>
                  ) : <div className="text-sm text-muted-text/80">Coordinator will be announced.</div>}
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-bold text-neon-magenta mb-2">Prize Pool</h4>
                  <div className="text-lg font-rajdhani font-bold text-neon-magenta">{details.prize || "TBD"}</div>
                </div>

                <div className="flex flex-col gap-3 mt-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-full btn-secondary px-4 py-2 rounded font-medium">Register</button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <a href={details.register_url || event.register_url || "#"} target="_blank" rel="noreferrer" className="w-full btn-secondary px-4 py-2 rounded text-center">Register / More</a>
                  </SignedIn>

                  <button onClick={() => onCloseRef.current && onCloseRef.current()} className="w-full py-2 rounded border border-white/10 text-sm">Close</button>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 0 2px rgba(255,106,0,0.22) inset, 0 12px 40px rgba(0,0,0,0.6)" }} />
      </motion.div>

      <style jsx>{`
        .event-modal-content::-webkit-scrollbar { width: 10px; height: 10px; }
        .event-modal-content::-webkit-scrollbar-track { background: transparent; }
        .event-modal-content::-webkit-scrollbar-thumb { background: rgba(255,106,0,0.25); border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
        .event-modal-content { scrollbar-width: thin; scrollbar-color: rgba(255,106,0,0.25) transparent; }
      `}</style>
    </div>
  )
}

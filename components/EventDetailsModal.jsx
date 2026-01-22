// components/EventDetailsModal.jsx
"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { eventDetails } from "@/data/eventsDetails" // keep as your file

function slugify(title = "") {
  return title
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeText(t = "") {
  return t.toString().toLowerCase().replace(/[^a-z0-9]/g, "")
}

export default function EventDetailsModal({ event, onClose }) {
  if (!event) return null

  // Try multiple ways to find matching details in eventDetails.js
  const slugFromTitle = slugify(event.title || event.name || "")
  const slugFromId = slugify(event.id || "")
  const baseTitle = (event.title || "").split(":")[0].trim()
  const slugFromBaseTitle = slugify(baseTitle)

  let details = {}

  // 1) exact id key (if id matches key in eventDetails)
  if (event.id && eventDetails[slugFromId]) {
    details = eventDetails[slugFromId]
  }
  // 2) exact title slug match
  else if (slugFromTitle && eventDetails[slugFromTitle]) {
    details = eventDetails[slugFromTitle]
  }
  // 3) base title match (title before colon)
  else if (slugFromBaseTitle && eventDetails[slugFromBaseTitle]) {
    details = eventDetails[slugFromBaseTitle]
  }
  // 4) try raw id (sometimes keys are not slugified exactly)
  else if (event.id && eventDetails[event.id]) {
    details = eventDetails[event.id]
  }
  // 5) fuzzy search: compare normalized title to eventDetails' title fields
  else {
    const target = normalizeText(event.title || event.name || event.id || "")
    for (const k of Object.keys(eventDetails)) {
      const edTitle = normalizeText(eventDetails[k].title || k)
      if (edTitle && target && (edTitle === target || edTitle.includes(target) || target.includes(edTitle))) {
        details = eventDetails[k]
        break
      }
    }
  }

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKey(e) {
      if (e.key === "Escape") onCloseRef.current?.()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const show = (v, fallback = "TBD") => (v ? v : fallback)

  // Helpers to read possibly inconsistent keys from event JSON
  const getRegistrationFee = () =>
    details.registration_fee ||
    details.registrationFee ||
    event.registration_fee ||
    event.registrationFee ||
    event["Registration fee "] ||
    event["Registration fee"] ||
    event["Registration Fee"] ||
    event["Registration Fee "] ||
    "—"

  const getParticipationType = () =>
    details.participation_type ||
    details.participationType ||
    details.participation ||
    event.participation_type ||
    event.team_size ||
    event.teamSize ||
    event.team_size ||
    "Individual"

  const getVenue = () => details.venue || event.venue || "—"

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop: click closes */}
      <motion.button
        aria-label="Close modal"
        onClick={() => onCloseRef.current?.()}
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
        className="relative w-full max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Inline orange border as requested */}
        <div
          className="relative bg-[#041014]/96 text-white rounded-2xl border-2"
          style={{ borderColor: "rgba(255,106,0,0.85)" }}
        >
          {/* close top-right */}
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => onCloseRef.current?.()}
              className="text-sm px-3 py-1 rounded bg-black/20 hover:opacity-90"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* content area */}
          <div className="event-modal-content max-h-[72vh] overflow-y-auto p-6 md:p-8">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-wider text-neon-cyan mb-3">
              {show(details.title || event.title || event.name, "Untitled Event")}
            </h2>

            {/* Overview */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neon-magenta mb-1">Overview</h4>
              <p className="text-sm text-muted-text/90">
                {show(details.overview || event.description || details.description, "Overview not provided.")}
              </p>
            </div>

            {/* Judging */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neon-magenta mb-2">Judging</h4>
              {details.judging && details.judging.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-white/90 space-y-1">
                  {details.judging.map((j, i) => (
                    <li key={i}>{j}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-text/80">Judging details not provided.</p>
              )}
            </div>

            {/* Elimination condition */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neon-magenta mb-1">Elimination Condition</h4>
              <p className="text-sm text-muted-text/90">
                {show(details.elimination_condition || details.eliminationCondition || event.elimination_condition, "Not specified")}
              </p>
            </div>

            {/* Small grid for short facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div>
                <h4 className="text-sm font-medium text-neon-magenta mb-1">Participation</h4>
                <div className="text-sm text-white/90">{show(getParticipationType(), "Individual")}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neon-magenta mb-1">Venue</h4>
                <div className="text-sm text-white/90">{show(getVenue(), "—")}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neon-magenta mb-1">Registration Fee</h4>
                <div className="text-sm text-white/90">{show(getRegistrationFee(), "—")}</div>
              </div>
              <div></div>
            </div>
          </div>

          {/* FOOTER: Register button added here */}
          <div className="px-6 md:px-8 py-4 border-t border-white/6 bg-transparent flex flex-col sm:flex-row gap-3 items-center">
            {/* Left: show register (full width on small screens) */}
            <div className="w-full sm:w-auto flex-1">
              {/* Replace your existing SignedOut / SignedIn block with this */}

{/* LEFT: Register area */}
<div>
  {/* <Link
    href="/register"
    className="w-full text-center px-4 py-2 rounded-lg font-semibold text-black
               bg-gradient-to-r from-[#06F7FF] via-[#00C2FF] to-[#06F7FF]
               shadow-[0_14px_40px_rgba(6,247,255,0.14)] block
               transform-gpu will-change-transform
               animate-[pulseScale_1s_ease-in-out_infinite_alternate]"
    aria-label="Register"
  >
    REGISTER NOW
  </Link> */}

      {/* Small helper text */}
      {/* <p className="text-xs text-muted-text/90 mt-1">
        First sign in, then register.
      </p>
    </div> */}
  

  {/* <SignedIn>
    <Link
      href={event.register_url || "#"}
      className="w-full text-center btn-secondary hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 block px-4 py-2 rounded-lg font-semibold"
    >
      Register
    </Link>
  </SignedIn> */}
</div>

            </div>

            {/* Right: optional small close button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onCloseRef.current?.()}
                className="w-full md:w-32 text-center px-4 py-2 rounded bg-black/20 hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* subtle inner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              "0 0 0 2px rgba(255,106,0,0.18) inset, 0 12px 40px rgba(0,0,0,0.5)",
          }}
        />
      </motion.div>

      <style jsx>{`
        .event-modal-content::-webkit-scrollbar { width: 10px; height: 10px; }
        .event-modal-content::-webkit-scrollbar-track { background: transparent; }
        .event-modal-content::-webkit-scrollbar-thumb { background: rgba(255,106,0,0.23); border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
        .event-modal-content { scrollbar-width: thin; scrollbar-color: rgba(255,106,0,0.23) transparent; }

        @media (max-width: 640px) {
          .event-modal-content { padding: 16px; }
        }
      `}</style>
    </div>
  )
}

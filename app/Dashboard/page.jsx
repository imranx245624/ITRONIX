"use client"

import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [loadingRegs, setLoadingRegs] = useState(false)
  const [registrations, setRegistrations] = useState(null)
  const [regsError, setRegsError] = useState("")

  // contact modal state
  const [showContact, setShowContact] = useState(false)
  const contactRef = useRef(null)

  // === TECH CONTACT (edit these with your real details) ===
  const TECH_NAME = "Imran Ali" // your name (as requested)
  const TECH_PHONE = "+91 9905956912" // replace with your real number
  const CONTACT_EMAIL = "itronix@gncasc.org"
  // =======================================================

  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchRegs = async () => {
      setLoadingRegs(true)
      setRegsError("")
      try {
        // Get user email from Clerk
        const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress
        
        if (!userEmail) {
          setRegistrations([])
          setRegsError("Email not found")
          setLoadingRegs(false)
          return
        }

        // Fetch by email instead of userId
        const res = await fetch(`/api/registrations?email=${encodeURIComponent(userEmail)}`)
        
        if (!res.ok) {
          setRegistrations([])
          // if server returns 404 or empty, show friendly message
          const txt = await res.text().catch(() => "")
          setRegsError(txt || "No registrations found yet.")
        } else {
          const json = await res.json()
          setRegistrations(json.registrations ?? [])
          if (!json.registrations || json.registrations.length === 0) {
            setRegsError("") // show the friendly "no registrations" UI instead of error box
          } else {
            setRegsError("")
          }
        }
      } catch (err) {
        setRegistrations([])
        setRegsError("Failed to load registrations.")
        console.error("fetch regs error:", err)
      } finally {
        setLoadingRegs(false)
      }
    }

    fetchRegs()
  }, [isLoaded, user])

  // Contact modal helpers
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowContact(false)
    }
    if (showContact) {
      document.addEventListener("keydown", onKey)
    }
    return () => document.removeEventListener("keydown", onKey)
  }, [showContact])

  useEffect(() => {
    function handleClickOutside(e) {
      if (showContact && contactRef.current && !contactRef.current.contains(e.target)) {
        setShowContact(false)
      }
    }
    if (showContact) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showContact])

  // <-- moved this AFTER all hooks so hook order never changes -->
  if (!isLoaded) return null

  const displayName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "—"
  const phone = user?.phoneNumber ?? ""
  
  // Get latest registration for activity
  const latestReg = registrations && registrations.length > 0 ? registrations[0] : null

  return (
    // NOTE: vertical centering only on md+ screens — mobile will use normal top-aligned flow
    <div className="relative top-0 pt-20 pb-24 bg-deep-night min-h-screen md:flex md:items-center md:justify-center">
      <div className="relative top-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Mobile compact header + quick actions */}
        <div className="sm:hidden mb-6">
          <div className="flex items-center justify-between p-4 bg-deep-night/60 border border-cyber-orange/100 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-deep-night/40 to-deep-night/70 border border-neon-cyan/20 p-1 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profileImageUrl} alt="avatar" className="w-10 h-10 rounded-md object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-deep-night/60 flex items-center justify-center text-neon-cyan font-bold">
                    {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-neon-cyan">{displayName || "Participant"}</div>
                {/* <div className="text-xs text-muted-text truncate w-40">{email}</div> */}
              </div>
            </div>

            <SignOutButton>
              <button className="px-3 py-2 rounded-md bg-deep-night/30 border border-neon-cyan/30 text-sm">Sign out</button>
            </SignOutButton>
          </div>

          <div className="mt-3 flex gap-3">
            {/* <Link href="/workshops" className="btn-secondary flex-1 text-center">
              Workshops
            </Link> */}
            {/* <Link href="/account" className="btn-primary flex-1 text-center">
              Account
            </Link> */}
          </div>

          {/* <div className="mt-3 p-3 card-dark rounded-xl">
            {loadingRegs ? (
              <div className="text-sm text-muted-text">Loading registrations…</div>
            ) : regsError ? (
              <div className="text-sm text-neon-magenta">{regsError}</div>
            ) : registrations && registrations.length > 0 ? (
              <div>
                <div className="text-xs text-neon-cyan/80">Latest registration</div>
                <div className="font-medium mt-1 text-sm text-neon-cyan truncate">{registrations[0].registration_type ?? "Registration"}</div>
                <div className="text-xs text-muted-text mt-1">{new Date(registrations[0].created_at).toLocaleString()}</div>
              </div>
            )
             : (
               <div className="text-sm text-muted-text">You don't have any registrations yet. Tap Workshops to browse.</div>
            )
            }
          </div> */}
        </div>

        {/* header */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-deep-night/40 to-deep-night/70 border border-neon-cyan/20 p-1 flex items-center justify-center">
              {/* profile image */}
              {user?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImageUrl} alt="avatar" className="w-14 h-14 rounded-md object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-md bg-deep-night/60 flex items-center justify-center text-neon-cyan font-bold">
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg md:text-2xl font-rajdhani font-bold text-neon-cyan">
                Welcome, {displayName || "Participant"}
              </h2>
              {/* <p className="text-sm text-muted-text mt-1">{email}</p> */}
              {/* <p className="text-xs text-muted-text mt-1">Member ID: <span className="text-neon-magenta">{user?.id}</span></p> */}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <div className="hidden sm:flex items-center gap-2">
              {/* <Link href="/workshops" className="btn-secondary px-4 py-2">
                Browse Workshops
              </Link> */}

              <SignOutButton>
                <button className="ml-1 btn-ghost px-3 py-2 border border-neon-cyan/100 rounded  text-xs">Sign out</button>
              </SignOutButton>
            </div>

            {/* Mobile actions: show Dashboard button (current page) and signout */}
            <div className="flex sm:hidden items-center gap-2">
              <Link href="/workshops" className="p-2 rounded-md bg-deep-night/40 border border-neon-cyan/10 text-neon-cyan text-sm">
                Workshops
              </Link>
              <SignOutButton>
                <button className="p-2 rounded-md bg-deep-night/30 border border-neon-cyan/10 text-sm">Sign out</button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center items-center">
          {/* Left column: user info card (centered on desktop via lg:col-start-2) */}
          <aside className="lg:col-span-1 lg:col-start-2 card-dark p-6 border border-neon-cyan/100 rounded-2xl">
            <h3 className="font-rajdhani text-neon-cyan text-lg mb-3">Your Info</h3>

            <div className="space-y-3 text-sm text-muted-text">
              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Name</span>
                <div className="mt-1 font-medium">{displayName || "—"}</div>
              </div>

              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Email</span>
                <div className="mt-1">{email}</div>
              </div>

              {/* <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Phone</span>
                <div className="mt-1">{phone || "—"}</div>
              </div> */}

              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Joined</span>
                <div className="mt-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
              </div>
            </div>

            <div className="mt-6">
              {/* <Link href="/account" className="w-full btn-secondary block text-center">
                Manage account
              </Link> */}
            </div>
          </aside>

          {/* Right / main column: registrations */}
          {/* <section className="lg:col-span-2 card-dark p-6 border border-neon-cyan/20 rounded-2xl">
            (commented-out registrations block left exactly as you had it)
          </section> */}
        </div>

        {/* Footer quick links */}
        <div className="relative h-30 mt-8 text-center text-sm text-muted-text">
          <p>
            Need help?{" "}
            <button
              onClick={() => setShowContact(true)}
              className="text-neon-cyan underline hover:text-neon-cyan/80 transition"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>

      {/* Contact modal (small & simple) */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* blurred background overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div
            ref={contactRef}
            role="dialog"
            aria-modal="true"
            className="relative z-60 w-full max-w-sm mx-4 bg-deep-night/95 border border-cyber-orange/100 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-neon-cyan font-rajdhani font-semibold text-lg">Contact </h3>
                <p className="text-sm text-muted-text mt-1">Reach out for technical help or any other query.</p>
              </div>
              <div>
                <button
                  onClick={() => setShowContact(false)}
                  aria-label="Close"
                  className="text-sm px-3 py-1 rounded-md border border-neon-magenta/30"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                {/* <div className="text-xs uppercase text-neon-cyan/70">Name</div>
                <div className="font-medium ">Technical Head</div> */}
              </div>

              <div>
                <div className="text-xs uppercase text-neon-cyan/70">Phone</div>
                <div className="">{TECH_PHONE}</div>
              </div>

              <div>
                <div className="text-xs uppercase text-neon-cyan/70">ITRONIX Email</div>
                <div className="">{CONTACT_EMAIL}</div>
              </div>

              <div className="pt-2">
                 <button
                  onClick={() => {
                    // copy contact phone to clipboard
                    try {
                      navigator.clipboard.writeText(TECH_PHONE)
                      alert("Number copied")
                    } catch (err) {
                      alert("Copy failed")
                    }
                  }}
                  className="ml-3 px-3 py-2 text-sm rounded-md border border-neon-magenta/30"
                >
                  Copy phone number
                </button>
                <button
                  onClick={() => {
                    // copy contact email to clipboard
                    try {
                      navigator.clipboard.writeText(CONTACT_EMAIL)
                      alert("ITRONIX email copied")
                    } catch (err) {
                      alert("Copy failed")
                    }
                  }}
                  className="ml-3 px-3 py-2 text-sm rounded-md border border-neon-magenta/30"
                >
                  Copy Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile sticky action bar */}
      {/* <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 sm:hidden z-50 flex gap-3 bg-deep-night/90 p-2 rounded-full border border-neon-cyan/10 shadow-lg">
        <Link href="/workshops" className="px-4 py-2 rounded-md btn-secondary text-sm">
          Workshops
        </Link>
        <Link href="/account" className="px-4 py-2 rounded-md btn-primary text-sm">
          Account
        </Link>
        <SignOutButton>
          <button className="px-3 py-2 rounded-md bg-deep-night/30 border border-neon-cyan/10 text-sm">Sign out</button>
        </SignOutButton>
      </div> */}
    </div>
  )
}

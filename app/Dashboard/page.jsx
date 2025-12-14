"use client"

import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [loadingRegs, setLoadingRegs] = useState(false)
  const [registrations, setRegistrations] = useState(null)
  const [regsError, setRegsError] = useState("")

  useEffect(() => {
    if (!isLoaded || !user) return

    // try to fetch user's registrations from your API
    const fetchRegs = async () => {
      setLoadingRegs(true)
      setRegsError("")
      try {
        // API should accept ?userId=... and return { registrations: [...] }
        const res = await fetch(`/api/registrations?userId=${user.id}`)
        if (!res.ok) {
          // if not implemented, gracefully handle
          setRegistrations([])
          setRegsError("No registrations found or API not implemented.")
        } else {
          const json = await res.json()
          setRegistrations(json.registrations ?? [])
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

  if (!isLoaded) return null

  const displayName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "—"

  return (
    <div className="relative top-20 min-h-screen bg-deep-night py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-deep-night/40 to-deep-night/70 border border-neon-cyan/20 p-1 flex items-center justify-center">
              {/* profile image */}
              {user?.profileImageUrl ? (
                // using regular img fallback so Next Image doesn't require loader config
                // if you prefer, replace with <Image> and set loader
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImageUrl} alt="avatar" className="w-16 h-16 rounded-md object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-md bg-deep-night/60 flex items-center justify-center text-neon-cyan font-bold">
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-rajdhani font-bold text-neon-cyan text-glow">
                Welcome, {displayName || "Participant"}
              </h2>
              <p className="text-sm text-muted-text mt-1">{email}</p>
              <p className="text-xs text-muted-text mt-1">Member ID: <span className="text-neon-magenta">{user?.id}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <Link href="/register" className="btn-primary px-4 py-2">
              Register for Events
            </Link> */}

            <Link href="/workshops" className="btn-secondary px-4 py-2 hidden sm:inline-block">
              Browse Workshops
            </Link>

            {/* Clerk sign out */}
            <SignOutButton>
              <button className="ml-1 btn-ghost px-3 py-2 border border-neon-cyan/10 text-xs">Sign out</button>
            </SignOutButton>
          </div>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: user info card */}
          <div className="lg:col-span-1 card-dark p-6 border border-neon-cyan/20 rounded-2xl">
            <h3 className="font-rajdhani text-neon-cyan text-lg mb-3">Your Info</h3>

            <div className="space-y-2 text-sm text-muted-text">
              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Name</span>
                <div className="mt-1 font-medium">{displayName || "—"}</div>
              </div>

              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Email</span>
                <div className="mt-1">{email}</div>
              </div>

              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Phone</span>
                <div className="mt-1">{user?.phoneNumber ?? "—"}</div>
              </div>

              <div>
                <span className="block text-xs uppercase text-neon-cyan/70">Joined</span>
                <div className="mt-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/account" className="w-full btn-secondary block text-center">
                Manage account
              </Link>
            </div>
          </div>

          {/* Middle: registrations */}
          <div className="lg:col-span-2 card-dark p-6 border border-neon-cyan/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-rajdhani text-neon-cyan text-lg">Your Registrations</h3>
              <div className="text-sm text-muted-text">Latest activity</div>
            </div>

            {loadingRegs ? (
              <div className="py-12 flex items-center justify-center">
                <div className="loader" />
              </div>
            ) : regsError ? (
              <div className="p-4 bg-neon-magenta/10 border border-neon-magenta/20 rounded-md">
                <p className="text-sm text-neon-magenta font-medium">Info</p>
                <p className="text-sm text-muted-text mt-1">{regsError}</p>
                <div className="mt-3 flex gap-2">
                  {/* <Link href="/register" className="btn-primary text-xs">
                    Register now
                  </Link> */}
                  <Link href="/workshops" className="btn-secondary text-xs">
                    Browse workshops
                  </Link>
                </div>
              </div>
            ) : registrations && registrations.length === 0 ? (
              <div className="p-6 text-center text-muted-text">
                <p className="mb-3">You don't have any registrations yet.</p>
                <div className="flex justify-center gap-3">
                  {/* <Link href="/register" className="btn-primary">
                    Register for events
                  </Link> */}
                  <Link href="/workshops" className="btn-secondary">
                    Buy workshop
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations?.map((r) => (
                  <div key={r.id || `${r.type}-${r.createdAt}`} className="p-4 border border-neon-cyan/10 rounded-lg bg-deep-night/40 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-neon-cyan">{r.title ?? r.registrationType ?? "Registration"}</div>
                      <div className="text-xs text-muted-text mt-1">{r.college ?? r.meta?.college ?? "—"}</div>
                      <div className="text-xs text-muted-text mt-1">Registered: {new Date(r.createdAt ?? Date.now()).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* payment status */}
                      <div className={`text-xs px-3 py-1 rounded-md ${r.paymentStatus === "paid" ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/20" : "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/20"}`}>
                        {r.paymentStatus === "paid" ? "Paid" : r.paymentStatus ?? "Pending"}
                      </div>

                      {/* if workshop has sponsorUrl, redirect */}
                      {r.type === "workshop" && r.sponsorUrl ? (
                        <a href={r.sponsorUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
                          Open workshop
                        </a>
                      ) : (
                        <Link href="/register" className="btn-ghost text-xs">
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer quick links */}
        <div className="mt-8 text-center text-sm text-muted-text">
          <p>
            Need help? <Link href="/contact" className="text-neon-cyan underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

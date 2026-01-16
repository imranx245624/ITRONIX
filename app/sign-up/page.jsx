"use client"

import { useSearchParams } from "next/navigation"
import { SignUp } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function SignUpPage() {
  const params = useSearchParams()
  const redirectTo = params.get("redirectTo") || "/dashboard"
  const signInUrl = `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`

  // Ensure we only render on client to avoid hydration diffs and to let z-index take effect reliably
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    // fixed full-screen overlay so sign-up sits above everything
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 214744 }} // very high z-index to ensure it's on top
      aria-labelledby="signup-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* dim the background but keep sign-up visible */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* centered card */}
      {/* Adjusted sizing for mobile: smaller max-width and allow vertical scrolling (max-h) so the form is fully accessible on small screens */}
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-115 mx-auto my-6 max-h-[90vh] overflow-auto">
        <div className="bg-[#041014]/98 rounded-2xl p-4 md:p-6 shadow-2xl border border-neon-cyan/20">
          <h2 id="signup-modal-title" className="sr-only">Sign up</h2>

          <SignUp
            afterSignInUrl={redirectTo}
            afterSignUpUrl={redirectTo}
            signInUrl={signInUrl}
            routing="hash" /* <- FIX: use hash-based routing to avoid catch-all requirement */
          />
        </div>
      </div>
    </div>
  )
}

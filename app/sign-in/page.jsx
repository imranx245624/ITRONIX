"use client"

import { useSearchParams } from "next/navigation"
import { SignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const params = useSearchParams()
  // read redirectTo from query param, fallback to dashboard
  const redirectTo = params.get("redirectTo") || "/dashboard"

  // build sign-up URL that preserves redirectTo so user can switch
  const signUpUrl = `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`

  // Ensure we only render on client to avoid hydration diffs and to let z-index take effect reliably
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // if (!mounted) return null

  return (
    // fixed full-screen overlay so sign-in sits above everything
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 2147444 }}
      aria-labelledby="signin-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* dim the background but keep sign-in visible */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* centered card */}
      {/* Adjusted sizing for mobile: use smaller max-width and allow vertical scrolling (max-h) so the form is fully accessible on small screens */}
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-115 mx-auto my-6 max-h-[90vh] overflow-auto">
        <div className="bg-[#041014]/98 rounded-2xl p-4 md:p-6 shadow-2xl border border-neon-cyan/20">
          <h2 id="signin-modal-title" className="sr-only">Sign in</h2>

          <SignIn
            afterSignInUrl={redirectTo}
            afterSignUpUrl={redirectTo}
            signUpUrl={signUpUrl}
            routing="hash" // use hash-based routing to avoid needing a catch-all route
          />
        </div>
      </div>
    </div>
  )
}

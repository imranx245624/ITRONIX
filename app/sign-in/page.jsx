"use client"

import { useSearchParams } from "next/navigation"
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  const params = useSearchParams()
  // read redirectTo from query param, fallback to dashboard
  const redirectTo = params.get("redirectTo") || "/dashboard"

  // build sign-up URL that preserves redirectTo so user can switch
  const signUpUrl = `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-night">
      <SignIn
        afterSignInUrl={redirectTo}
        afterSignUpUrl={redirectTo}
        signUpUrl={signUpUrl}
        routing="hash" // use hash-based routing to avoid needing a catch-all route
      />
    </div>
  )
}
"use client"

import { useSearchParams } from "next/navigation"
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  const params = useSearchParams()
  const redirectTo = params.get("redirectTo") || "/dashboard"
  const signInUrl = `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-night">
      <SignUp
        afterSignInUrl={redirectTo}
        afterSignUpUrl={redirectTo}
        signInUrl={signInUrl}
        // No routing prop needed for path-based (catch-all) routing
      />
    </div>
  )
}
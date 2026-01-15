"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-night">
      <SignUp
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  )
}

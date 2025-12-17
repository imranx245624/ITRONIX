// components/ClerkProviderClient.jsx
"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { usePathname, useSearchParams } from "next/navigation"

/*
  Clerk automatically reads NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from env.
  We pass current URL info so Clerk can handle redirects correctly in App Router.
*/
export default function ClerkProviderClient({ children }) {
  const pathname = usePathname()
  const search = useSearchParams()?.toString() ?? ""

  // full path to use as after sign in redirect target if needed
  const currentPath = `${pathname}${search ? "?" + search : ""}`

  return (
    <ClerkProvider
      // Do not hardcode keys here; Clerk reads publishable key from env var NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      navigate={(to) => {
        // use client navigation, Clerk will call this on redirect
        window.location.href = to
      }}
      // optional: pass "current path" so Clerk knows current route (helpful for redirects)
      // session only: The prop name can be used but not required.
    >
      {children}
    </ClerkProvider>
  )
}

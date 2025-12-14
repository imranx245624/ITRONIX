// components/ClerkProviderClient.jsx
"use client"

import { ClerkProvider } from "@clerk/nextjs"

export default function ClerkProviderClient({ children }) {
  // Clerk reads NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from env automatically.
  return <ClerkProvider>{children}</ClerkProvider>
}

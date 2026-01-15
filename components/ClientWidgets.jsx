"use client"

import dynamic from "next/dynamic"
import React from "react"

// Dynamically load heavy interactive widgets on the client only.
// We must perform the ssr:false dynamic imports from a Client Component
// — Next.js does not allow ssr:false inside Server Components (app/layout.jsx).

const FloatingAIButton = dynamic(() => import("@/components/ai/FloatingAIButton"), {
  ssr: false,
  loading: () => null,
})
const ContactWidget = dynamic(() => import("@/components/ContactWidget"), {
  ssr: false,
  loading: () => null,
})

export default function ClientWidgets() {
  return (
    <>
      <FloatingAIButton />
      <ContactWidget />
    </>
  )
}
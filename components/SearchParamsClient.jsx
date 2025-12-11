// app/components/SearchParamsClient.jsx
"use client"

import { useSearchParams } from "next/navigation"

export default function SearchParamsClient() {
  const params = useSearchParams()
  const tag = params?.get("tag") ?? ""   // change key if you use q or filter etc
  // keep minimal DOM (or render UI if needed)
  return <div data-tag={tag} style={{ display: "none" }} />
}

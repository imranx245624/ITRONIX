// app/events/SearchParamsClient.jsx
"use client"
import { useSearchParams } from "next/navigation"

export default function SearchParamsClient({ onParams }) {
  const params = useSearchParams()
  const q = params.get("q") ?? ""
  // either render minimal UI or call a prop
  // if you need to pass value to server-rendered sibling, render UI only
  return <div data-query={q} />
}

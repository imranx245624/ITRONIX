"use client"

import { useCallback, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function Filters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const debounceTimer = useRef(null)

  const activeFilter = searchParams.get("filter") || "all"
  const searchQuery = searchParams.get("q") || ""

  const handleFilterClick = useCallback(
    (filter) => {
      const params = new URLSearchParams()
      if (filter !== "all") params.set("filter", filter)
      if (searchQuery) params.set("q", searchQuery)
      router.push(`/events${params.toString() ? "?" + params.toString() : ""}`)
    },
    [searchQuery, router],
  )

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value

      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Set new timer to update URL after user stops typing
      debounceTimer.current = setTimeout(() => {
        const params = new URLSearchParams()
        if (activeFilter !== "all") params.set("filter", activeFilter)
        if (query) params.set("q", query)
        router.push(`/events${params.toString() ? "?" + params.toString() : ""}`)
      }, 500)
    },
    [activeFilter, router],
  )

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const filters = [
    { label: "All Events", value: "all" },
    { label: "💻 Tech Events", value: "hackathon" },
    { label: "💡 Creative Events", value: "nonit" },
    { label: "🎮 Cyber Arena", value: "cyber" },
  ]

  return (
    <div className="bg-deep-night/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6 mb-12">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search events by title or tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 rounded-lg bg-deep-night border border-neon-cyan/30 text-white font-poppins placeholder-neon-cyan/50 focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/30 transition-all"
          aria-label="Search events"
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value)}
              className={`px-4 py-2 rounded-full font-rajdhani font-semibold transition-all duration-300 ${
                activeFilter === filter.value
                  ? "bg-neon-cyan text-deep-night shadow-lg shadow-neon-cyan/50"
                  : "bg-transparent border border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:shadow-md hover:shadow-neon-cyan/30"
              }`}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

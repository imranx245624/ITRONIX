"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import events from "@/data/events.json"
import EventCard from "@/components/EventCard"
import EventsBanner from "@/components/EventsBanner"
import Filters from "@/components/Filters"
import { normalizeCategory } from "@/lib/event-utils"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const filter = searchParams.get("filter") || "all"
    const query = searchParams.get("q") || ""
    setActiveFilter(filter)
    filterEvents(filter, query)
  }, [searchParams])

  const filterEvents = (filter, searchQuery) => {
    let filtered = events

    if (filter !== "all") {
      filtered = filtered.filter((event) => normalizeCategory(event.category) === filter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredEvents(filtered)
  }

  const categories = [
    {
      id: "hackathon",
      label: "💻 Tech EventS",
      // description: "Competitive technical challenges designed to test coding, logic, and real-world problem-solving skills.",
      description: "",

    },
    {
      id: "innovation-fair",
      label: "💡 Creative Events",
      // description: "Engaging creativity-based activities that blend innovation, imagination, and interactive participation.",
      
      description: "",
    },
    {
      id: "cyber-arena",
      label: "🎮 Cyber Arena",
      description: "High-energy e-sports battles where players compete for skill, strategy, and victory.",
      description: "",

    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <>
      <EventsBanner />

      <section className="min-h-screen bg-deep-night py-16 px-4 sm:px-6 lg:px-8">
        <div className=" max-w-6xl mx-auto">
          <Filters />

          {activeFilter === "all" ? (
            // Show all categories
            <div className="space-y-20">
              {categories.map((category) => {
                // use normalizeCategory to gather events that may have variant category labels
                const categoryEvents = events.filter((e) => normalizeCategory(e.category) === category.id)
                // debug counts (remove in production)
                console.log("category", category.id, "count", categoryEvents.length)

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    id={`section-${category.id}`}
                    className="scroll-mt-20"
                  >
                    <div className=" flex flex-center justify-center mb-8 border-2  border-neon-cyan/60 rounded-full px-4 py-2 bg-deep-night/40 backdrop-blur-sm">
                      <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-wider text-neon-cyan mb-3">
                        {category.label}
                      </h2>
                      <p className="text-muted-text font-poppins text-lg max-w-3xl" >{category.description}</p>
                    </div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {categoryEvents.length > 0 ? (
                        categoryEvents.map((event, idx) => (
                          <EventCard key={`${category.id}-${idx}-${event.id}`} event={event} index={idx} />
                        ))
                      ) : (
                        <div className="col-span-full">
                          <div className="card-dark p-8 text-center">
                            <p className="text-muted-text font-serif">No events added yet — check back soon.</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            // Show filtered events
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => <EventCard key={`${event.id}-${idx}`} event={event} index={idx} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-text font-poppins text-lg">No events found matching your search.</p>
                </div>
              )}
            </motion.div>
          )}

         // Make sure file has: import { motion } from "framer-motion"
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="mt-24 pt-20 border-t border-neon-cyan/20"
>
  <h2 className="text-3xl md:text-4xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-8 text-center">
    Event Schedule
  </h2>

  {/* Short intro / note */}
  <p className="text-center text-sm text-muted-text max-w-2xl mx-auto mb-8">
    All events happen on <strong>23 January</strong>. Timings & locations below — please reach 10 minutes earlier for venue checks.
  </p>

  {/* Responsive grid: left column = timeline (times), right column = events grouped by time/venue */}
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
    {/* Left: morning block (main ceremonies + presentations) */}
    <div className="card-dark p-5">
      <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-4">Main schedule — morning</h3>

      <div className="space-y-4 text-sm font-poppins text-muted-text">
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">09:00 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Inauguration Ceremony</p>
            <p className="text-xs text-muted-text">Aura Hall 5th Floor</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">09:00 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Vibe Coding</p>
            <p className="text-xs text-muted-text">2nd Floor Lab</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">09:00 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">BGMI Tournament</p>
            <p className="text-xs text-muted-text">Room 309</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">09:00 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Free Fire</p>
            <p className="text-xs text-muted-text">Room 206</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">09:30 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Presentation</p>
            <p className="text-xs text-muted-text">Aura Hall 5th Floor</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right: mid-day & competitions */}
    <div className="card-dark p-5">
      <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-4">Competitions & tracks</h3>

      <div className="space-y-4 text-sm font-poppins text-muted-text">
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">10:00 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Blind Typing</p>
            <p className="text-xs text-muted-text">3rd Floor Lab</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">11:30 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Bug Busters</p>
            <p className="text-xs text-muted-text">3rd Floor Lab</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">11:30 AM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Treasure Hunt</p>
            <p className="text-xs text-muted-text">A7 Lobby</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <p className="text-neon-cyan font-semibold">12:00 PM</p>
          </div>
          <div>
            <p className="font-semibold text-white">Code Golf</p>
            <p className="text-xs text-muted-text">2nd Floor Lab</p>
          </div>
        </div>
      </div>
    </div>

    {/* Full-width closing block */}
    <div className="col-span-1 md:col-span-2">
      <div className="card-dark p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-rajdhani font-bold text-neon-cyan">Closing Ceremony</h4>
          <p className="text-sm text-muted-text">After completion of all events — Aura Hall 5th Floor</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-text flex justify left">Note:</p>
          <p className="text-xs text-neon-magenta italic">Arrive 10 minutes early for venue checks. Timings subject to minor changes.</p>
        </div>
      </div>
    </div>
  </div>
</motion.div>

        </div>
      </section>
    </>
  )
}

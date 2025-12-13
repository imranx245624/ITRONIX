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
      label: "💻Tech EventS",
      description: "Competitive technical challenges designed to test coding, logic, and real-world problem-solving skills.",
    },
    {
      id: "innovation-fair",
      label: "💡Creative Events",
      description: "Engaging creativity-based activities that blend innovation, imagination, and interactive participation.",
    },
    {
      id: "cyber-arena",
      label: "🎮 Cyber Arena",
      description: "High-energy e-sports battles where players compete for skill, strategy, and victory.",
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
        <div className="max-w-6xl mx-auto">
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
                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-3">
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
                            <p className="text-muted-text font-poppins">No events added yet — check back soon.</p>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-24 pt-20 border-t border-neon-cyan/20"
          >
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold uppercase tracking-wider text-neon-cyan mb-12 text-center">
              Event Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Day 1 */}
              <div className="card-dark">
                <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-4">Day 1 • 23 january</h3>
                <div className="space-y-3 font-poppins text-muted-text text-sm">
                  <div>
                    <p className="text-neon-cyan font-semibold">09:00</p>
                    <p>Opening Ceremony</p>
                  </div>
                  {/* <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">10:00</p>
                    <p>Keynote: "Simulating Cities" (Alumni Panel)</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">11:30</p>
                    <p>Workshops start (AI Bootcamp)</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">15:00</p>
                    <p>Hackathon kick-off</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">20:00</p>
                    <p>Evening lightning talks</p>
                  </div> */}
                </div>
              </div>

              {/* Day 2 */}
              {/* <div className="card-dark">
                <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-4">Day 2 • 23 March</h3>
                <div className="space-y-3 font-poppins text-muted-text text-sm">
                   <div>
                    <p className="text-neon-cyan font-semibold">09:30</p>
                    <p>Robotics qualifiers</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">12:00</p>
                    <p>Speaker session: "From Idea to Startup"</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">14:00</p>
                    <p>Hackathon continues</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">18:00</p>
                    <p>Gaming finals</p>
                  </div> 
                </div>
              </div> */}

              {/* Day 3 */}
              <div className="card-dark">
                <h3 className="text-xl font-rajdhani font-bold text-neon-magenta mb-4">Day 2 • 24 january</h3>
                <div className="space-y-3 font-poppins text-muted-text text-sm">
                  {/* <div>
                    <p className="text-neon-cyan font-semibold">10:00</p>
                    <p>Hackathon final pitches</p>
                  </div> */}
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">21:00</p>
                    <p>Prize distribution & certificates</p>
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3">
                    <p className="text-neon-cyan font-semibold">22:00</p>
                    <p>Closing ceremony</p>
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

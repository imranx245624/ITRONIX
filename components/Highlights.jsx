"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Highlights() {
  const router = useRouter()
  const [navLoading, setNavLoading] = useState(false)

  const highlights = [
    {
      title: "TECH Events",
      description: "Competitive technical challenges designed to test coding, logic, and real-world problem-solving skills.",
      tags: ["UI-Verse", "Web Development", "Bug out", "Blind Typing", "Code Golf", "Vibe Coding"],
      href: "/events?filter=hackathon",
      icon: "💻",
    },
    {
      title: "Creative Events",
      description: "Engaging creativity-based activities that blend innovation, imagination, and interactive participation.",
      tags: ["Treasure Hunt", "PPT Presentation(Techy)", "Byte Sized Battles"],
      href: "/events?filter=innovation-fair",
      icon: "💡",
    },
    {
      title: "Cyber Arena",
      description: "High-energy e-sports battles where players compete for skill, strategy, and victory.",
      tags: ["BGMI", "Free Fire", "Ludo King"],
      href: "/events?filter=cyber-arena",
      icon: "🎮",
    },
  ]

  // slugify same way we expect in events list (lowercase, non-alnum -> hyphen)
  const slugify = (s = "") =>
    s
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  // helper to build href (q param + hash)
  const buildHref = (tag) => {
    const q = encodeURIComponent(tag.trim())
    const slug = slugify(tag)
    return `/events?q=${q}#${slug}`
  }

  // click handler: navigate and then ensure scrolling to target element (fallback)
  const handleTagClick = async (e, tag) => {
    // allow normal ctrl/cmd+click, middle-click to open in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return

    e.preventDefault()
    const slug = slugify(tag)
    const href = `/events?q=${encodeURIComponent(tag.trim())}#${slug}`

    setNavLoading(true)
    // navigate first
    try {
      // router.push may or may not return a promise depending on runtime, but call it anyway
      await router.push(href)
    } catch (err) {
      // ignore; still attempt to scroll
      console.warn("router.push error (ignored):", err)
    }

    // Poll for element for up to 2 seconds, then stop
    const start = Date.now()
    const maxWait = 2000
    const interval = 100

    const tryScroll = () => {
      // Check for element by id or data attribute (both supported)
      const elById = document.getElementById(slug)
      const elByData = document.querySelector(`[data-event-slug="${slug}"]`)
      const el = elById || elByData

      if (el) {
        // smooth scroll into center view
        try {
          el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
        } catch (err) {
          // fallback instant
          el.scrollIntoView()
        }
        setNavLoading(false)
        return
      }

      if (Date.now() - start < maxWait) {
        setTimeout(tryScroll, interval)
      } else {
        // give up gracefully
        setNavLoading(false)
      }
    }

    // small delay to allow DOM to render
    setTimeout(tryScroll, 150)
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-deep-night font-serif">
      <div className="max-w-6xl mx-auto font-serif">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 font-serif">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="group card-dark border border-neon-cyan/100 hover:border-neon-magenta/5000 transition-all duration-500 transform hover:scale-105 cursor-pointer font-serif p-6"
            >
              <Link href={item.href} className="no-underline">
                <div className="text-3xl sm:text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg sm:text-2xl font-serif font-bold uppercase text-neon-cyan mb-3 group-hover:text-neon-magenta transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-poppins text-muted-text leading-relaxed text-sm sm:text-base mb-4 font-serif">
                  {item.description}
                </p>
              </Link>

              <div className="flex flex-wrap gap-2 mt-2 font-serif">
                {item.tags.map((tag, i) => {
                  const slug = slugify(tag)
                  const href = buildHref(tag)
                  return (
                    <Link
                      key={i}
                      href={href}
                      onClick={(e) => handleTagClick(e, tag)}
                      className="inline-flex items-center justify-center text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded border border-neon-cyan/20 hover:bg-neon-cyan/20 hover:scale-105 transition transform"
                      aria-label={`View events for ${tag}`}
                    >
                      {tag}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* optional small status indicator */}
        {navLoading && (
          <div className="mt-4 text-sm text-muted-text">
            Navigating and locating the event... (if not found, the events list may not include matching id.)
          </div>
        )}
      </div>

      {/* IMPORTANT:
          On the /events page make sure each event item has either:
            id={slugify(event.title || event.name || event.id)}
          OR
            data-event-slug={slugify(...)}
          so the code above can find and scroll to it.
      */}
    </section>
  )
}

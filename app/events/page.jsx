'use client'

import Header from "@/components/Header"
import EventsPage from "@/components/EventsPage"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Events - ITRONIX-2K26 | Guru Nanak College Techfest",
  description: "Featured events at ITRONIX-2K26 — Hackathon, Robotics Arena, AI Challenge, Code Sprint, Cyber Arena",
}

export default function Events() {
  return (
    <>
      <Header />
      <main>
        <EventsPage />
      </main>
      <Footer />
    </>
  )
}

import { Suspense } from "react"
// import '../styles/globals.css'
import Header from "@/components/Header"
import EventsPage from "@/components/EventsPage"
import Footer from "@/components/Footer"

export const metadata = { /* ... */ }

export default function Events() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div/>}>
          <EventsPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

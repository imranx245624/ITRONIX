import Header from "@/components/Header"
import EventsPage from "@/components/EventsPage"
import Footer from "@/components/Footer"
import SearchParamsClient from "./SearchParamsClient"

export const metadata = { /* keep metadata here */ }

export default function Events() {
  return (
    <>
      <Header />
      <main>
        <SearchParamsClient />
        <EventsPage />
      </main>
      <Footer />
    </>
  )
}

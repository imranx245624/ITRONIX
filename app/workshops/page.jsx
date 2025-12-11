import Header from "@/components/Header"
import WorkshopsPage from "@/components/WorkshopsPage"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Workshops - ITRONIX-2K26 | Guru Nanak College Techfest",
  description: "Learning workshops at ITRONIX-2K26 — AI & ML Bootcamp, IoT & Embedded Systems, Web Dev",
}

export default function Workshops() {
  return (
    <>
      <Header />
      <main>
        <WorkshopsPage />
      </main>
      <Footer />
    </>
  )
}

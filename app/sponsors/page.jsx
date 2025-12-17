import Header from "@/components/Header"
import SponsorsPage from "@/components/SponsorsPage"
import Footer from "@/components/Footer"
// import '../styles/globals.css'

export const metadata = {
  title: "Sponsors - ITRONIX-2K26 | Guru Nanak College Techfest",
  description: "Sponsors and partners of ITRONIX-2K26 techfest. Sponsorship packages available",
}

export default function Sponsors() {
  return (
    <>
      <Header />
      <main>
        <SponsorsPage />
      </main>
      <Footer />
    </>
  )
}

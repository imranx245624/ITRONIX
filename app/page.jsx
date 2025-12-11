// "use client"

import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Highlights from "@/components/Highlights"
import Gallery from "@/components/Gallery"
import About from "@/components/About"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Gallery />
        <About />
      </main>
      <Footer />
    </>
  )
}

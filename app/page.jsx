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
      {/* main has id to allow Hero to compute scroll target */}
      <main id="site-main">
        <Hero />
        <Highlights />
        <Gallery />
        <About />
      </main>
      {/* <Footer /> */}
    </>
  )
}

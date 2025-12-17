import { Suspense } from "react"
import SearchParamsClient from "@/components/SearchParamsClient"
import Header from "@/components/Header"
import RegisterPage from "@/components/RegisterPage"
import Footer from "@/components/Footer"
// import '../styles/globals.css'

export const metadata = { /* ... */ }

export default function Register() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div/>}>
          <SearchParamsClient />
        </Suspense>

        <RegisterPage />
      </main>
      <Footer />
    </>
  )
}

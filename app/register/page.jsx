import Header from "@/components/Header"
import RegisterPage from "@/components/RegisterPage"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Register - ITRONIX-2K26 | Guru Nanak College Techfest",
  description: "Register for ITRONIX-2K26 events and workshops. Limited seats available.",
}

export default function Register() {
  return (
    <>
      <Header />
      <main>
        <RegisterPage />
      </main>
      <Footer />
    </>
  )
}

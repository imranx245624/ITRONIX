"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import RegisterForm from "@/components/RegisterForm"

function RegisterContent() {
  const searchParams = useSearchParams()
  const eventParam = searchParams.get("event")
  const workshopParam = searchParams.get("workshop")

  return (
    <section className="min-h-screen bg-deep-night py-20 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 w-full h-90 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/bg1.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.3) blur(1px)",
        }}
      />
      <div className="max-w-2xl mx-auto z-10 relative top-16">
        <div className="mb-12 text-center">
          <h1 className="font-serif section-title mb-4">REGISTER</h1>
          <p className="text-muted-text font-serif max-w-md mx-auto ">
            Team or individual registrations open. Limited seats — early bird benefits for campus participants.
          </p>
        </div>

        <div className="card-dark border-2 border-neon-cyan/30 p-8">
          <RegisterForm preselectedEvent={eventParam} preselectedWorkshop={workshopParam} />
        </div>
      </div>
    </section>
  )
}

export default function RegisterPageComponent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-night" />}>
      <RegisterContent />
    </Suspense>
  )
}

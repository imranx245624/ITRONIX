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
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="section-title mb-4">REGISTER</h1>
          <p className="text-muted-text font-poppins">
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

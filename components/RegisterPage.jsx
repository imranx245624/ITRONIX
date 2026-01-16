"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Suspense, useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import RegisterForm from "@/components/RegisterForm"

function RegisterContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const eventParam = searchParams.get("event")
  const workshopParam = searchParams.get("workshop")

  // modal state
  const [showRules, setShowRules] = useState(false)
  const [agreeChecked, setAgreeChecked] = useState(false)
  const closeBtnRef = useRef(null)

  // Prevent hydration mismatches:
  // render RULES button / modal only on the client after mount.
  // This avoids server/client attribute differences (hydration warnings)
  // caused by toggling UI immediately in a mount-effect.
  const [mounted, setMounted] = useState(false)

  // Clerk auth
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    // mark as mounted on client
    setMounted(true)
    // open rules modal only on client (previous behavior: open on mount)
    setShowRules(true)
  }, [])

  useEffect(() => {
    // focus the close/agree button when modal opens for accessibility
    if (showRules && closeBtnRef.current) {
      closeBtnRef.current.focus()
    }
  }, [showRules])

  useEffect(() => {
    // Wait until Clerk finishes loading. If user is NOT signed-in, redirect to Clerk sign-in page.
    // We include the current path+search as redirectTo so Clerk page can send user back after signin.
    if (!isLoaded) return

    if (!isSignedIn) {
      // build current location including querystring
      const q = searchParams.toString()
      const current = q ? `${pathname}?${q}` : pathname
      // push to your existing Clerk sign-in route and pass redirectTo param
      router.push(`/sign-in?redirectTo=${encodeURIComponent(current)}`)
    }
    // If user is signed in, do nothing (they keep on this page)
  }, [isLoaded, isSignedIn, pathname, searchParams, router])

  return (
    <section className="min-h-screen bg-deep-night py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* subtle background image */}
      <div
        className="absolute inset-0 w-full h-90 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/bg1.png)",
          filter: "saturate(1.3) contrast(1.1) brightness(0.3) blur(1px)",
        }}
        aria-hidden="true"
      />

      {/* ===== Rules quick-open button (fixed top-right) =====
          NOTE: Rendered only after client mount to avoid hydration mismatches.
          This preserves your behavior but prevents server/client attribute differences.
      */}
      {mounted && (
        <button
          type="button"
          onClick={() => setShowRules(true)}
          aria-controls="rules-modal"
          aria-expanded={showRules}
          className="fixed right-4 top-26 z-[500] px-3 py-2 rounded-full bg-neon-cyan text-black font-semibold shadow-[0_8px_30px_rgba(6,200,255,0.12)] hover:scale-105 transform-gpu transition-all duration-200"
        >
          RULES
        </button>
      )}

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

      {/* RULES MODAL */}
      {mounted && showRules && (
        <div
          id="rules-modal"
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rules-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowRules(false)}
            aria-hidden="true"
          />

          {/* modal box */}
          <div className="relative z-[9999] w-full max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#041014]/96 text-white rounded-2xl border-2 border-cyber-orange/100">
              {/* header */}
              <div className="flex items-start justify-between p-4 md:p-6 border-b border-white/6">
                <div>
                  <h2 id="rules-title" className="text-lg md:text-2xl font-serif font-bold text-neon-cyan">
                    Important — Rules & Guidelines
                  </h2>
                  <h3 className="text-xs md:text-sm text-muted-text mt-1">
                    Please read these rules carefully before{" "}
                    <span className="bg-neon-cyan/20 px-1 rounded-md bold text-sm md:text-base">registration</span> in any event.
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRules(false)}
                    aria-label="Close rules"
                    className="px-3 py-1 rounded bg-black/20 hover:opacity-90 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* body: scrollable */}
              <div className="max-h-[50vh] overflow-y-auto p-4 md:p-6 space-y-4">
                <div className="bg-transparent text-sm md:text-base text-muted-text leading-relaxed">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      All participants must strictly follow the rules and guidelines specified for their respective events.
                    </li>
                    <li>
                      Any misconduct, use of unfair means, violation of event rules, or indiscipline will lead to immediate disqualification.
                    </li>
                    <li>
                      Participants must report to the event venue on time as per the schedule communicated after successful registration. Late entry may not be permitted.
                    </li>
                    <li>
                      The decision of the judges and event coordinators is final and binding. No arguments or appeals will be entertained thereafter.
                    </li>
                    <li>
                      Participants must carry a valid college ID card and produce it when asked by event coordinators.
                    </li>
                    <li>
                      Use of prohibited materials, unauthorized devices, or external assistance (including restricted AI tools) is not allowed unless explicitly permitted.
                    </li>
                    <li>
                      Any damage to college property or event equipment will be taken seriously; the participant(s) involved will be held responsible.
                    </li>
                    <li>
                      The organizing committee reserves the right to modify event rules, schedules, or venues if required due to unforeseen circumstances.
                    </li>
                    <li>
                      Maintain a respectful and professional attitude toward judges, coordinators, volunteers, and fellow participants throughout the fest.
                    </li>
                    <li>
                      Winners will be awarded cash prizes, trophies, and certificates as announced by the organizing committee.
                    </li>
                    <li>
                      Students from any degree program with basic IT knowledge are eligible to participate unless stated otherwise for a specific event.
                    </li>
                  </ol>
                </div>

                {/* short summary box */}
                {/* <div className="mt-2 p-3 bg-white/5 border border-white/6 rounded-md">
                  <p className="text-xs md:text-sm text-muted-text">
                    By clicking <strong>I Agree</strong> you confirm that you have read, understood, and will comply with the above rules.
                  </p>
                </div> */}
              </div>

              {/* footer with actions */}
              <div className="p-4 md:p-6 border-t border-white/6 flex flex-col sm:flex-row items-center gap-3 justify-between bg-transparent">
                <div className="flex items-center gap-3">
                  {/* <label className="inline-flex items-center gap-2 cursor-pointer text-sm md:text-base">
                    <input
                      type="checkbox"
                      checked={agreeChecked}
                      onChange={(e) => setAgreeChecked(e.target.checked)}
                      className="w-4 h-4 rounded border-neon-cyan/30 bg-deep-night/50"
                    />
                    <span className="text-sm md:text-base text-muted-text">I have read and agree to the rules</span>
                  </label> */}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* <button
                    onClick={() => setShowRules(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-transparent border border-white/8 hover:bg-white/3 text-sm md:text-base"
                  >
                    Read Later
                  </button> */}

                  {/* <button
                    ref={closeBtnRef}
                    onClick={() => {
                      // If you want to enforce acceptance, require agreeChecked
                      // If not required, we still close.
                      if (!agreeChecked) {
                        // show a small animation/feedback
                        // simple visual feedback - flash border (quick)
                        // for simplicity, use alert here (or you can implement toast)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                        // small browser alert
                        alert("Please check 'I have read and agree to the rules' before continuing.")
                        return
                      }
                      setShowRules(false)
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-cyan text-black font-semibold text-sm md:text-base"
                  >
                    I Agree & Continue
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
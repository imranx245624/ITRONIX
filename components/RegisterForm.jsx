"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import eventPricing from "@/data/eventPricing.json"

export default function RegisterForm({ preselectedEvent, preselectedWorkshop }) {
  const router = useRouter()
  const { user: clerkUser } = useUser()

  const WORKSHOPS = [
    { id: "ws-1", name: "Web Dev: From Idea to Launch", url: "http://www.google.co.in/" },
    { id: "ws-2", name: "AI & ML Bootcamp", url: "https://youtube.com/" },
    { id: "ws-3", name: "IoT & Embedded Systems", url: "http://instagram.com/" },
    { id: "ws-4", name: "Robotics Hands-on", url: "https://www.canva.com/" },
  ]

  const EVENTS = [

    { id: "e-blind-typing", name: "Blind Typing", mode: "individual" },
    { id: "e-web", name: "Web Development", mode: "individual" },
    { id: "e-vibe", name: "Vibe Coding", mode: "individual" },
    { id: "e-golf", name: "Code Golf", mode: "individual" },
    { id: "e-busters", name: "Bug-Busters", mode: "individual" },
    { id: "e-hack", name: "Hackathon", mode: "individual" },

    { id: "e-Treasure", name: "Treasure Hunt", mode: "team" },
    { id: "e-byte", name: "Byte Sized Battles", mode: "team" },
    { id: "e-presentation", name: "Presentation", mode: "team" },


    { id: "e-bgmi", name: "BGMI Tournament", mode: "team" },
    { id: "e-free-fire", name: "Free Fire", mode: "team" }, 
    { id: "e-ludo", name: "Ludo King", mode: "team" },

  ]

  const initialCategory = preselectedWorkshop ? "workshop" : preselectedEvent ? "event" : ""

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    category: initialCategory, // "workshop" | "event"
    registrationType: preselectedWorkshop || preselectedEvent || "", // workshop id/name or event id/name
    teamMembers: "", // comma separated names
    consent: false,
  })

  const [signedInEmail, setSignedInEmail] = useState(null)
  useEffect(() => {
    if (clerkUser?.emailAddresses?.[0]?.emailAddress) {
      setSignedInEmail(clerkUser.emailAddresses[0].emailAddress)
      setFormData((prev) => ({ ...prev, email: clerkUser.emailAddresses[0].emailAddress }))
      return
    }

    if (typeof window !== "undefined" && window.__USER_EMAIL) {
      setSignedInEmail(window.__USER_EMAIL)
      setFormData((prev) => ({ ...prev, email: window.__USER_EMAIL }))
      return
    }

    try {
      const fromStorage = localStorage?.getItem("userEmail")
      if (fromStorage) {
        setSignedInEmail(fromStorage)
        setFormData((prev) => ({ ...prev, email: fromStorage }))
        return
      }
    } catch (err) {
      // ignore storage errors
    }

    setSignedInEmail(null)
  }, [clerkUser])

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    setFormData((s) => ({
      ...s,
      category: initialCategory,
      registrationType: preselectedWorkshop || preselectedEvent || s.registrationType,
    }))
  }, [preselectedEvent, preselectedWorkshop])

  const selectedEventObj = EVENTS.find((ev) => ev.id === formData.registrationType || ev.name === formData.registrationType)
  const selectedWorkshopObj = WORKSHOPS.find((ws) => ws.id === formData.registrationType || ws.name === formData.registrationType)
  const isTeamEvent = selectedEventObj?.mode === "team"
  const eventPrice = selectedEventObj ? eventPricing[selectedEventObj.id] || 0 : 0

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.college.trim()) newErrors.college = "College / Department is required"
    if (!formData.category) newErrors.category = "Please select Workshop or Event"
    if (!formData.registrationType) newErrors.registrationType = `Please select a ${formData.category || "registration"} type`
    if (formData.category === "event" && isTeamEvent && !formData.teamMembers.trim())
      newErrors.teamMembers = "Team member names are required for team events (comma separated)"
    if (!formData.consent) newErrors.consent = "You must accept the terms to register"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "email" && signedInEmail) return
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleCategoryChange = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      registrationType: "", // reset selection when switching category
      teamMembers: "",
    }))
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      category: formData.category,
      registration_type: formData.registrationType,
      team_members: formData.teamMembers.trim(),
      consent: formData.consent,
      amount: formData.category === "event" ? eventPrice : 0,
      payment_status: formData.category === "event" ? "pending" : "pending",
      payment_id: null,
      sponsor_url: selectedWorkshopObj?.url || null,
      metadata: { event_mode: selectedEventObj?.mode || null },
      created_at: new Date().toISOString(),
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ submit: data.error || "Failed to submit. Try again." })
        setIsSubmitting(false)
        return
      }

      setSubmitSuccess(true)
      setSubmitMessage(data.message || "Registration successful! Opening workshop in new tab...")

      setTimeout(() => {
        if (formData.category === "workshop") {
          const url = selectedWorkshopObj?.url
          if (url) {
            window.open(url, "_blank")
          }
          router.push("/Dashboard")
        } else {
          const params = new URLSearchParams({
            event: formData.registrationType,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          })
          router.push(`/payment?${params.toString()}`)
        }
      }, 1200)
    } catch (err) {
      console.error("Registration error:", err)
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitSuccess && (
        <div className="p-4 bg-cyber-orange/10 border border-cyber-orange/30 rounded-lg">
          <p className="font-poppins text-cyber-orange font-semibold mb-1">Registration received</p>
          <p className="font-poppins text-sm text-muted-text">{submitMessage}</p>
        </div>
      )}

      {errors.submit && (
        <div className="p-3 bg-neon-magenta/10 border border-neon-magenta/30 rounded">
          <p className="font-poppins text-neon-magenta">{errors.submit}</p>
        </div>
      )}

      {/* Basic fields */}
      <div>
        <label htmlFor="fullName" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Full Name <span className="text-neon-magenta">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          placeholder="Your name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-neon-magenta">{errors.fullName}</p>}
      </div>

      {/* EMAIL INPUT – Read-only if signed in, editable otherwise */}
      <div>
        <label htmlFor="email" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Email <span className="text-neon-magenta">*</span>
        </label>
        
        {signedInEmail ? (
          <>
            {/* Read-only input when signed in (user can select/copy) */}
            <input
              id="email"
              name="email_display"
              type="text"
              value={formData.email}
              readOnly
              aria-readonly="true"
              aria-describedby="emailHelp"
              onFocus={(e) => e.target.select()}
              className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none cursor-default opacity-90"
            />
            
            {/* Hidden input for form submission */}
            <input type="hidden" name="email" value={formData.email} />

            {/* Helper text with lock icon */}
            <p id="emailHelp" className="mt-2 text-sm text-muted-text flex items-center gap-2">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" />
              </svg>
              <span>
                Signed in as <strong>{formData.email}</strong> — email is fixed for this registration.
              </span>
            </p>
          </>
        ) : (
          /* Editable input when not signed in */
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            placeholder="your@email.com"
          />
        )}
        {errors.email && <p className="mt-1 text-sm text-neon-magenta">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Phone <span className="text-neon-magenta">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          placeholder="+91 XXXXXXXXXX"
        />
        {errors.phone && <p className="mt-1 text-sm text-neon-magenta">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="college" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          College / Department <span className="text-neon-magenta">*</span>
        </label>
        <input
          id="college"
          name="college"
          value={formData.college}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          placeholder="Your college name"
        />
        {errors.college && <p className="mt-1 text-sm text-neon-magenta">{errors.college}</p>}
      </div>

      {/* Category: Workshop / Event */}
      <div>
        <p className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">Participation Type <span className="text-neon-magenta">*</span></p>
        <div className="flex gap-4">
          <label className={`px-4 py-2 rounded-lg border ${formData.category === "workshop" ? "border-neon-cyan bg-deep-night/30" : "border-neon-cyan/20"} cursor-pointer`}>
            <input
              type="radio"
              name="category"
              value="workshop"
              checked={formData.category === "workshop"}
              onChange={() => handleCategoryChange("workshop")}
              className="hidden"
            />
            <span className="font-poppins">Workshop</span>
          </label>

          <label className={`px-4 py-2 rounded-lg border ${formData.category === "event" ? "border-neon-cyan bg-deep-night/30" : "border-neon-cyan/20"} cursor-pointer`}>
            <input
              type="radio"
              name="category"
              value="event"
              checked={formData.category === "event"}
              onChange={() => handleCategoryChange("event")}
              className="hidden"
            />
            <span className="font-poppins">Event</span>
          </label>
        </div>
        {errors.category && <p className="mt-1 text-sm text-neon-magenta">{errors.category}</p>}
      </div>

      {/* Conditional dropdown */}
      {formData.category === "workshop" && (
        <div>
          <label htmlFor="registrationType" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">Choose Workshop <span className="text-neon-magenta">*</span></label>
          <select
            id="registrationType"
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 appearance-none"
          >
            <option value="">Select a workshop...</option>
            {WORKSHOPS.map((ws) => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
          {errors.registrationType && <p className="mt-1 text-sm text-neon-magenta">{errors.registrationType}</p>}
        </div>
      )}

      {formData.category === "event" && (
        <div>
          <label htmlFor="registrationType" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
            Choose Event <span className="text-neon-magenta">*</span>
          </label>
          <select
            id="registrationType"
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 appearance-none"
          >
            <option value="">Select an event...</option>
            {EVENTS.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} {ev.mode === "team" ? "(Team)" : "(Individual)"} - ₹{eventPricing[ev.id] || 0}
              </option>
            ))}
          </select>
          {errors.registrationType && <p className="mt-1 text-sm text-neon-magenta">{errors.registrationType}</p>}

          {selectedEventObj && (
            <div className="mt-3 p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
              <p className="font-poppins text-sm text-neon-cyan">
                <span className="font-semibold">Registration Fee:</span> ₹{eventPrice}
              </p>
            </div>
          )}

          {isTeamEvent && (
            <div className="mt-3">
              <label htmlFor="teamMembers" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
                Team Members (Names, comma-separated) <span className="text-neon-magenta">*</span>
              </label>
              <textarea
                id="teamMembers"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 resize-none"
                placeholder="list like this --> imran, ayush, birendra, Afzal"
              />
              {errors.teamMembers && <p className="mt-1 text-sm text-neon-magenta">{errors.teamMembers}</p>}
            </div>
          )}
        </div>
      )}

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="w-5 h-5 mt-0.5 rounded border-neon-cyan/30 text-neon-cyan bg-deep-night/50 cursor-pointer"
          />
          <span className="font-poppins text-sm text-muted-text group-hover:text-neon-cyan transition-colors">
            I accept the terms & conditions and agree to use of my data for event communications.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-neon-magenta">{errors.consent}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-5 py-3 rounded-lg font-poppins font-semibold bg-neon-cyan text-black disabled:opacity-60 transition"
      >
        {isSubmitting ? "Please wait..." : formData.category === "workshop" ? "Proceed to Workshop" : formData.category === "event" ? "Proceed to Payment" : "Register Now"}
      </button>
    </form>
  )
}

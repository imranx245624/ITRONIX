"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
// If using Clerk auth, import useUser hook
import { useUser } from "@clerk/nextjs"
import eventPricing from "@/data/eventPricing.json"
import collegesData from "@/data/colleges.json" // ← minimal change: import colleges JSON directly

/*
  RegisterForm.jsx
  - College autocomplete (from /data/colleges.json)
  - Course autocomplete (from /data/courses.json -> all_courses)
  - Restored workshop dropdown and event dropdown + team members
  - Submit posts to /api/register (payload includes course)

  MODIFICATIONS:
  - Fix: Workshop redirect uses synchronous window.open to avoid popup blockers.
  - Fix: Event -> Payment flow uses router.push (with fallback).
  - Improved isSubmitting handling and error fallback (closes opened blank tab if request fails).
  - IMPORTANT: After successful /api/register this code now reads returned registration id
    (data.id || data.registrationId || data.insertedId) and appends registrationId to
    the /payment query params so payment page can update the same DB row.
  - Razorpay-related code (if present elsewhere) should be commented out in payment page;
    this file has no Razorpay calls to remove.

  HYDRATION NOTE:
  - To avoid React hydration warnings caused by browser extensions or any DOM attributes
    present on server HTML but differing on client (e.g. fdprocessedid), I've added
    `suppressHydrationWarning={true}` to form controls. This keeps your UI & logic unchanged
    while preventing the console error you reported.
*/

export default function RegisterForm({ preselectedEvent, preselectedWorkshop }) {
  const router = useRouter()
  const { user: clerkUser } = useUser()

  //Workshops list with UNIQUE URLs for each workshop
  const WORKSHOPS = [
    { id: "ws-1", name: "Web Dev: From Idea to Launch", url: "https://youtube.com" },
    { id: "ws-2", name: "AI & ML Bootcamp", url: "https://google.com" },
    { id: "ws-3", name: "IoT & Embedded Systems", url: "https://instagram.com" },
    { id: "ws-4", name: "Robotics Hands-on", url: "https://chatgpt.com" }
  ]

  // Events list — includes whether event is team or individual
  const EVENTS = [
    { id: "e-blind-typing", name: "Blind Typing", mode: "individual" },
    { id: "e-web", name: "Web Development", mode: "individual" },
    { id: "e-vibe", name: "Vibe Coding", mode: "individual" },
    { id: "e-golf", name: "Code Golf", mode: "individual" },
    { id: "e-busters", name: "Bug-Busters", mode: "individual" },
    { id: "e-hack", name: "Hackathon", mode: "team" },
    { id: "e-Treasure", name: "Treasure Hunt", mode: "team" },
    { id: "e-byte", name: "Byte Sized Battles", mode: "team" },
    { id: "e-presentation", name: "Presentation", mode: "team" },
    { id: "e-bgmi", name: "BGMI Tournament", mode: "team" },
    { id: "e-free-fire", name: "Free Fire", mode: "team" },
    { id: "e-ludo", name: "Ludo King", mode: "team" }
  ]

  const initialCategory = preselectedWorkshop ? "workshop" : preselectedEvent ? "event" : ""

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    category: initialCategory, // "workshop" | "event"
    registrationType: preselectedWorkshop || preselectedEvent || "", // workshop id/name or event id/name
    teamMembers: "", // comma separated names
    consent: false
  })

  // Detect signed-in email from Clerk or fallback sources
  const [signedInEmail, setSignedInEmail] = useState(null)
  useEffect(() => {
    // 1) Try Clerk user session first
    if (clerkUser?.emailAddresses?.[0]?.emailAddress) {
      setSignedInEmail(clerkUser.emailAddresses[0].emailAddress)
      setFormData((prev) => ({ ...prev, email: clerkUser.emailAddresses[0].emailAddress }))
      return
    }

    // 2) Fallback: check window.__USER_EMAIL (set by layout)
    if (typeof window !== "undefined" && window.__USER_EMAIL) {
      setSignedInEmail(window.__USER_EMAIL)
      setFormData((prev) => ({ ...prev, email: window.__USER_EMAIL }))
      return
    }

    // 3) Fallback: check localStorage
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

    // No signed-in email found
    setSignedInEmail(null)
  }, [clerkUser])

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  // if preselected props change after mount, sync them
  useEffect(() => {
    setFormData((s) => ({
      ...s,
      category: initialCategory,
      registrationType: preselectedWorkshop || preselectedEvent || s.registrationType
    }))
  }, [preselectedEvent, preselectedWorkshop])

  // helper to get selected event/workshop object
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
    if (!formData.course.trim()) newErrors.course = "Please select your course"
    if (!formData.category) newErrors.category = "Please select Workshop or Event"
    if (!formData.registrationType) newErrors.registrationType = `Please select a ${formData.category || "registration"} type`
    if (formData.category === "event" && isTeamEvent && !formData.teamMembers.trim()) newErrors.teamMembers = "Team member names are required for team events (comma separated)"
    if (!formData.consent) newErrors.consent = "You must accept the terms to register"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Prevent email change if signed in
    if (name === "email" && signedInEmail) return
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleCategoryChange = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      registrationType: "",
      teamMembers: ""
    }))
    setErrors({})
    // reset workshop/event selection UI if needed
  }

  // ----------------------------
  // Colleges autocomplete
  // (kept same as before — not changed)
  // ----------------------------
  const [colleges, setColleges] = useState([])
  const [collegeQuery, setCollegeQuery] = useState("")
  const [collegeSuggestions, setCollegeSuggestions] = useState([])
  const [collegeShowSuggestions, setCollegeShowSuggestions] = useState(false)
  const [collegeActiveIndex, setCollegeActiveIndex] = useState(-1)
  const collegeInputRef = useRef(null)
  const collegeSuggestionsRef = useRef(null)

  // === CHANGED: use imported collegesData instead of client fetch ===
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const json = collegesData
        const list = Array.isArray(json)
          ? json.map((it) => {
              if (typeof it === "string") return { name: it, city: "", state: "", type: "college", courses: [] }
              return { name: it.name || it.title || "", city: it.city || "", state: it.state || "", type: it.type || "college", courses: Array.isArray(it.courses) ? it.courses : [] }
            })
          : []
        if (!cancelled) setColleges(list)
      } catch (err) {
        if (!cancelled) setColleges([{ name: "Guru Nanak College of Arts, Commerce and Science", city: "Mumbai", state: "Maharashtra", type: "college", courses: ["B.Sc.", "B.Com", "B.A.", "BCA"] }])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const q = (collegeQuery || "").trim()
    if (!q) {
      setCollegeSuggestions([])
      setCollegeShowSuggestions(false)
      setCollegeActiveIndex(-1)
      return
    }
    const low = q.toLowerCase()
    const results = []
    for (let i = 0; i < colleges.length; i++) {
      const name = colleges[i].name || ""
      const ln = name.toLowerCase()
      let score = 0
      if (ln.startsWith(low)) score += 3
      if (ln.includes(low)) score += 1
      if (score > 0) results.push({ idx: i, name: colleges[i].name, score })
      if (results.length >= 200) break
    }
    results.sort((a, b) => b.score - a.score)
    const limited = results.slice(0, 50)
    setCollegeSuggestions(limited)
    setCollegeShowSuggestions(limited.length > 0)
    setCollegeActiveIndex(-1)
  }, [collegeQuery, colleges])

  const onCollegeKeyDown = (e) => {
    if (!collegeShowSuggestions) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCollegeActiveIndex((i) => Math.min(i + 1, collegeSuggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCollegeActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (collegeActiveIndex >= 0 && collegeSuggestions[collegeActiveIndex]) {
        pickCollege(collegeSuggestions[collegeActiveIndex].idx)
      } else if (collegeQuery.trim()) {
        // typed custom college
        setFormData((prev) => ({ ...prev, college: collegeQuery.trim(), course: "" }))
        setCollegeShowSuggestions(false)
      }
    } else if (e.key === "Escape") {
      setCollegeShowSuggestions(false)
      setCollegeActiveIndex(-1)
    }
  }

  function pickCollege(idx) {
    const c = colleges[idx]
    if (!c) return
    const name = c.name || ""
    setFormData((prev) => ({ ...prev, college: name, course: "" }))
    setCollegeQuery(name)
    setCollegeShowSuggestions(false)
    setCollegeActiveIndex(-1)
  }

  useEffect(() => {
    function onDocClick(e) {
      if (collegeInputRef.current && !collegeInputRef.current.contains(e.target) && collegeSuggestionsRef.current && !collegeSuggestionsRef.current.contains(e.target)) {
        setCollegeShowSuggestions(false)
        setCollegeActiveIndex(-1)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  // ----------------------------
  // Courses list (single master list) + autocomplete
  // ----------------------------
  const [coursesList, setCoursesList] = useState([]) // flat list from /data/courses.json -> all_courses
  const [courseQuery, setCourseQuery] = useState("")
  const [courseSuggestions, setCourseSuggestions] = useState([])
  const [courseShowSuggestions, setCourseShowSuggestions] = useState(false)
  const [courseActiveIndex, setCourseActiveIndex] = useState(-1)
  const courseInputRef = useRef(null)
  const courseSuggestionsRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function loadCourses() {
      try {
        const res = await fetch("/data/courses.json")
        if (res.ok) {
          const json = await res.json()
          // prefer explicit all_courses key; fallback to flatten default
          let list = []
          if (Array.isArray(json.all_courses)) {
            list = json.all_courses
          } else {
            // flatten _default arrays if present
            const dd = json._default || {}
            const keys = Object.keys(dd)
            keys.forEach((k) => {
              if (Array.isArray(dd[k])) list = list.concat(dd[k])
            })
            // also include any top-level arrays (rare)
            Object.keys(json).forEach((k) => {
              if (k !== "_default" && k !== "all_courses" && Array.isArray(json[k])) list = list.concat(json[k])
            })
          }
          // dedupe & keep order
          const deduped = Array.from(new Set(list))
          if (!cancelled) setCoursesList(deduped)
        } else {
          if (!cancelled) setCoursesList([
            "B.Sc. (Computer Science)",
            "B.Sc. (Information Technology)",
            "BCA",
            "B.Com",
            "B.A.",
            "B.Tech (CS)",
            "MCA",
            "MBA"
          ])
        }
      } catch (err) {
        if (!cancelled) setCoursesList([
          "B.Sc. (Computer Science)",
          "B.Sc. (Information Technology)",
          "BCA",
          "B.Com",
          "B.A.",
          "B.Tech (CS)",
          "MCA",
          "MBA"
        ])
      }
    }
    loadCourses()
    return () => { cancelled = true }
  }, [])

  // course autocomplete filtering
  useEffect(() => {
    const q = (courseQuery || "").trim()
    if (!q) {
      setCourseSuggestions([])
      setCourseShowSuggestions(false)
      setCourseActiveIndex(-1)
      return
    }
    const low = q.toLowerCase()
    const results = []
    for (let i = 0; i < coursesList.length; i++) {
      const it = coursesList[i]
      const ln = it.toLowerCase()
      let score = 0
      if (ln.startsWith(low)) score += 3
      if (ln.includes(low)) score += 1
      if (score > 0) results.push({ idx: i, text: it, score })
      if (results.length >= 200) break
    }
    results.sort((a, b) => b.score - a.score)
    const limited = results.slice(0, 50)
    setCourseSuggestions(limited)
    setCourseShowSuggestions(limited.length > 0)
    setCourseActiveIndex(-1)
  }, [courseQuery, coursesList])

  const onCourseKeyDown = (e) => {
    if (!courseShowSuggestions) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCourseActiveIndex((i) => Math.min(i + 1, courseSuggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCourseActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (courseActiveIndex >= 0 && courseSuggestions[courseActiveIndex]) {
        pickCourse(courseSuggestions[courseActiveIndex].idx)
      } else if (courseQuery.trim()) {
        // use typed value
        setFormData((prev) => ({ ...prev, course: courseQuery.trim() }))
        setCourseShowSuggestions(false)
      }
    } else if (e.key === "Escape") {
      setCourseShowSuggestions(false)
      setCourseActiveIndex(-1)
    }
  }

  function pickCourse(idx) {
    const c = coursesList[idx]
    if (!c) return
    setFormData((prev) => ({ ...prev, course: c }))
    setCourseQuery(c)
    setCourseShowSuggestions(false)
    setCourseActiveIndex(-1)
  }

  useEffect(() => {
    function onDocClick(e) {
      if (courseInputRef.current && !courseInputRef.current.contains(e.target) && courseSuggestionsRef.current && !courseSuggestionsRef.current.contains(e.target)) {
        setCourseShowSuggestions(false)
        setCourseActiveIndex(-1)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  // ----------------------------
  // End colleges + courses logic
  // ----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // IMPORTANT: for workshop we open a blank tab synchronously to avoid popup blocker.
    // We'll later navigate it to the real workshop URL after server confirms registration.
    let workshopBlankTab = null
    const willOpenWorkshop = formData.category === "workshop" && selectedWorkshopObj?.url
    if (willOpenWorkshop) {
      try {
        // open a blank tab in direct click handler context
        workshopBlankTab = window.open("", "_blank")
        // Give a tiny friendly message while we process (optional)
        if (workshopBlankTab) {
          workshopBlankTab.document.title = "Opening workshop..."
          workshopBlankTab.document.body.innerHTML = "<p style='font-family:system-ui,Arial; font-size:16px; padding:20px;'>Opening workshop — please wait...</p>"
        }
      } catch (err) {
        // if popup blocked, we will fallback to navigating same tab later
        workshopBlankTab = null
      }
    }

    setIsSubmitting(true)

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      course: formData.course.trim(),
      category: formData.category,
      registration_type: formData.registrationType,
      team_members: formData.teamMembers.trim(),
      consent: formData.consent,
      amount: formData.category === "event" ? eventPrice : 0,
      payment_status: formData.category === "event" ? "pending" : "pending",
      payment_id: null,
      sponsor_url: selectedWorkshopObj?.url || null,
      metadata: { event_mode: selectedEventObj?.mode || null },
      created_at: new Date().toISOString()
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        // close blank tab if we opened one
        if (workshopBlankTab && !workshopBlankTab.closed) {
          try { workshopBlankTab.close() } catch (e) {}
        }

        setErrors({ submit: data.error || "Failed to submit. Try again." })
        setIsSubmitting(false)
        return
      }

      // success - try to read registration id returned by server (common keys)
      const registrationId = data?.id || data?.registrationId || data?.insertedId || null

      setSubmitSuccess(true)
      setSubmitMessage(data.message || (formData.category === "workshop" ? "Registration ok — opening workshop..." : "Registration ok — redirecting to payment..."))

      // Short delay for UX — but small so window.open stays considered user-initiated
      setTimeout(() => {
        if (formData.category === "workshop") {
          const url = selectedWorkshopObj?.url
          if (url) {
            // If blank tab was opened, navigate it. Else open new tab (may be blocked).
            if (workshopBlankTab && !workshopBlankTab.closed) {
              try {
                workshopBlankTab.location.href = url
              } catch (err) {
                // fallback if we can't set location (cross-origin issues sometimes)
                window.open(url, "_blank")
              }
            } else {
              // last-resort: open new tab (may get blocked)
              try { window.open(url, "_blank") } catch (err) { window.location.href = url }
            }
          }

          // navigate main tab to dashboard (keep same tab)
          try {
            router.push("/Dashboard")
          } catch (err) {
            window.location.href = "/Dashboard"
          }
        } else {
          // event -> go to payment page with params
          const params = new URLSearchParams({
            event: formData.registrationType,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone
          })
          // append registrationId if server returned one so payment page can update same row
          if (registrationId) params.set("registrationId", registrationId)

          const paymentUrl = `/payment?${params.toString()}`

          try {
            router.push(paymentUrl)
          } catch (err) {
            // fallback
            window.location.href = paymentUrl
          }
        }
      }, 500)
    } catch (err) {
      console.error("Registration error:", err)
      // close blank tab if opened
      if (workshopBlankTab && !workshopBlankTab.closed) {
        try { workshopBlankTab.close() } catch (e) {}
      }
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
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
          suppressHydrationWarning={true}
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
              suppressHydrationWarning={true}
            />
            
            {/* Hidden input for form submission */}
            <input type="hidden" name="email" value={formData.email} suppressHydrationWarning={true} />

            {/* Helper text with lock icon */}
            <p id="emailHelp" className="mt-2 text-sm text-muted-text flex items-center gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
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
            suppressHydrationWarning={true}
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
          suppressHydrationWarning={true}
        />
        {errors.phone && <p className="mt-1 text-sm text-neon-magenta">{errors.phone}</p>}
      </div>

      {/* College autocomplete */}
      <div className="relative">
        <label htmlFor="college" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          College / School <span className="text-neon-magenta">*</span>
        </label>

        <div ref={collegeInputRef}>
          <input
            id="college"
            name="college_input"
            type="text"
            autoComplete="off"
            value={collegeQuery}
            onChange={(e) => {
              setCollegeQuery(e.target.value)
              setFormData((prev) => ({ ...prev, college: "", course: "" }))
            }}
            onKeyDown={onCollegeKeyDown}
            onFocus={() => { if (collegeSuggestions.length) setCollegeShowSuggestions(true) }}
            placeholder="Start typing your college or school name..."
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            aria-autocomplete="list"
            aria-controls="college-listbox"
            aria-expanded={collegeShowSuggestions}
            role="combobox"
            suppressHydrationWarning={true}
          />
        </div>

        <input type="hidden" name="college" value={formData.college} suppressHydrationWarning={true} />

        {errors.college && <p className="mt-1 text-sm text-neon-magenta">{errors.college}</p>}

        {collegeShowSuggestions && collegeSuggestions.length > 0 && (
          <ul
            id="college-listbox"
            ref={collegeSuggestionsRef}
            role="listbox"
            aria-label="College suggestions"
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-deep-night/95 border border-neon-cyan/20 p-1 shadow-lg"
            suppressHydrationWarning={true}
          >
            {collegeSuggestions.map((s, idx) => (
              <li
                key={s.idx + "-" + idx}
                role="option"
                aria-selected={collegeActiveIndex === idx}
                onMouseDown={(e) => { e.preventDefault(); pickCollege(s.idx) }}
                onMouseEnter={() => setCollegeActiveIndex(idx)}
                className={`px-3 py-2 text-sm cursor-pointer select-none ${collegeActiveIndex === idx ? "bg-neon-cyan/10 text-neon-cyan" : "text-muted-text hover:bg-deep-night/40"}`}
              >
                {s.name} <span className="text-xs text-muted-text"> — {colleges[s.idx]?.city || ''}{colleges[s.idx]?.state ? ', ' + colleges[s.idx].state : ''}</span>
              </li>
            ))}

            {collegeQuery.trim() && !collegeSuggestions.find(x => x.name === collegeQuery.trim()) && (
              <li
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault()
                  setFormData((prev) => ({ ...prev, college: collegeQuery.trim(), course: "" }))
                  setCollegeShowSuggestions(false)
                }}
                className="px-3 py-2 text-sm cursor-pointer select-none text-muted-text hover:bg-deep-night/40"
              >
                Use "{collegeQuery.trim()}"
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Course autocomplete (global list) */}
      <div className="relative">
        <label htmlFor="course" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Course / Stream <span className="text-neon-magenta">*</span>
        </label>

        <div ref={courseInputRef}>
          <input
            id="course"
            name="course_input"
            type="text"
            autoComplete="off"
            value={courseQuery || formData.course}
            onChange={(e) => {
              setCourseQuery(e.target.value)
              setFormData((prev) => ({ ...prev, course: "" }))
            }}
            onKeyDown={onCourseKeyDown}
            onFocus={() => { if (courseSuggestions.length) setCourseShowSuggestions(true) }}
            placeholder="Type and select your course (searchable)…"
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            aria-autocomplete="list"
            aria-controls="course-listbox"
            aria-expanded={courseShowSuggestions}
            role="combobox"
            suppressHydrationWarning={true}
          />
        </div>

        <input type="hidden" name="course" value={formData.course} suppressHydrationWarning={true} />

        {errors.course && <p className="mt-1 text-sm text-neon-magenta">{errors.course}</p>}

        {courseShowSuggestions && courseSuggestions.length > 0 && (
          <ul
            id="course-listbox"
            ref={courseSuggestionsRef}
            role="listbox"
            aria-label="Course suggestions"
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-deep-night/95 border border-neon-cyan/20 p-1 shadow-lg"
            suppressHydrationWarning={true}
          >
            {courseSuggestions.map((s, idx) => (
              <li
                key={s.idx + "-" + idx}
                role="option"
                aria-selected={courseActiveIndex === idx}
                onMouseDown={(e) => { e.preventDefault(); pickCourse(s.idx) }}
                onMouseEnter={() => setCourseActiveIndex(idx)}
                className={`px-3 py-2 text-sm cursor-pointer select-none ${courseActiveIndex === idx ? "bg-neon-cyan/10 text-neon-cyan" : "text-muted-text hover:bg-deep-night/40"}`}
              >
                {s.text}
              </li>
            ))}

            {courseQuery.trim() && !courseSuggestions.find(x => x.text === courseQuery.trim()) && (
              <li
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault()
                  setFormData((prev) => ({ ...prev, course: courseQuery.trim() }))
                  setCourseShowSuggestions(false)
                }}
                className="px-3 py-2 text-sm cursor-pointer select-none text-muted-text hover:bg-deep-night/40"
              >
                Use "{courseQuery.trim()}"
              </li>
            )}
          </ul>
        )}
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
              suppressHydrationWarning={true}
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
              suppressHydrationWarning={true}
            />
            <span className="font-poppins">Event</span>
          </label>
        </div>
        {errors.category && <p className="mt-1 text-sm text-neon-magenta">{errors.category}</p>}
      </div>

      {/* Conditional dropdowns */}
      {formData.category === "workshop" && (
        <div>
          <label htmlFor="registrationType" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">Choose Workshop <span className="text-neon-magenta">*</span></label>
          <select
            id="registrationType"
            name="registrationType"
            value={formData.registrationType}
            onChange={(e) => setFormData((prev) => ({ ...prev, registrationType: e.target.value }))}
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            suppressHydrationWarning={true}
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
          <label htmlFor="registrationType" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">Choose Event <span className="text-neon-magenta">*</span></label>
          <select
            id="registrationType"
            name="registrationType"
            value={formData.registrationType}
            onChange={(e) => setFormData((prev) => ({ ...prev, registrationType: e.target.value }))}
            className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            suppressHydrationWarning={true}
          >
            <option value="">Select an event...</option>
            {EVENTS.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} {ev.mode === "team" ? "(Team)" : "(Individual)"} - ₹{eventPricing[ev.id] || 0}
              </option>
            ))}
          </select>
          {errors.registrationType && <p className="mt-1 text-sm text-neon-magenta">{errors.registrationType}</p>}

          {/* show fee preview */}
          {selectedEventObj && (
            <div className="mt-3 p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
              <p className="font-poppins text-sm text-neon-cyan"><span className="font-semibold">Registration Fee:</span> ₹{eventPrice}</p>
            </div>
          )}

          {/* Team members only for team events */}
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
                placeholder="John Doe, Jane Doe"
                suppressHydrationWarning={true}
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
            suppressHydrationWarning={true}
          />
          <span className="font-poppins text-sm text-muted-text group-hover:text-neon-cyan transition-colors">
            I accept the terms & conditions and agree to use of my data for event communications.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-neon-magenta">{errors.consent}</p>}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-5 py-3 rounded-lg font-poppins font-semibold bg-neon-cyan text-black disabled:opacity-60 transition"
          suppressHydrationWarning={true}
        >
          {isSubmitting ? "Processing..." : formData.category === "workshop" ? "Proceed to Workshop" : formData.category === "event" ? "Proceed to Payment" : "Register Now"}
        </button>
      </div>
    </form>
  )
}

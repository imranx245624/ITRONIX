"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
// If using Clerk auth, import useUser hook
import { useUser } from "@clerk/nextjs"
import eventPricing from "@/data/eventPricing.json"
import collegesData from "@/data/colleges.json" // imported already
import coursesData from "@/data/courses.json"   // <-- NEW: import courses json directly

export default function RegisterForm({ preselectedEvent, preselectedWorkshop }) {
  const router = useRouter()
  const { user: clerkUser } = useUser()

  const WORKSHOPS = [
    { id: "ws-1", name: "NOT available", url: "https://example.com" }
  ]

  const EVENTS = [
    { id: "e-blind-typing", name: "Blind Typing", mode: "individual" },
    { id: "e-vibe", name: "Vibe Coding", mode: "individual" },
    { id: "e-golf", name: "Code Golf", mode: "individual" },
    { id: "e-busters", name: "Bug-Busters", mode: "individual" },
    { id: "e-Treasure", name: "Treasure Hunt", mode: "team" },
    { id: "e-presentation", name: "Presentation", mode: "team" },
    { id: "e-bgmi", name: "BGMI Tournament", mode: "team" },
    { id: "e-free-fire", name: "Free Fire", mode: "team" }
  ]

  const initialCategory = "event"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    category: initialCategory,
    registrationType: preselectedEvent || preselectedWorkshop || "",
    teamMembers: "",
    consent: false
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
    } catch (err) {}

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
      registrationType: preselectedEvent || preselectedWorkshop || s.registrationType
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
  }

  // ----------------------------
  // Colleges autocomplete (unchanged)
  // ----------------------------
  const [colleges, setColleges] = useState([])
  const [collegeQuery, setCollegeQuery] = useState("")
  const [collegeSuggestions, setCollegeSuggestions] = useState([])
  const [collegeShowSuggestions, setCollegeShowSuggestions] = useState(false)
  const [collegeActiveIndex, setCollegeActiveIndex] = useState(-1)
  const collegeInputRef = useRef(null)
  const collegeSuggestionsRef = useRef(null)

  useEffect(() => {
    // load colleges data from import (no fetch)
    try {
      const list = Array.isArray(collegesData)
        ? collegesData.map((it) => {
            if (typeof it === "string") return { name: it, city: "", state: "", type: "college", courses: [] }
            return { name: it.name || it.title || "", city: it.city || "", state: it.state || "", type: it.type || "college", courses: Array.isArray(it.courses) ? it.courses : [] }
          })
        : []
      setColleges(list)
    } catch (err) {
      // fallback single college
      setColleges([{ name: "Guru Nanak College of Arts, Commerce and Science", city: "Mumbai", state: "Maharashtra", type: "college", courses: ["B.Sc.", "B.Com", "B.A.", "BCA"] }])
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
        // user typed a custom college -> set and close
        setFormData((prev) => ({ ...prev, college: collegeQuery.trim(), course: "" }))
        setCollegeShowSuggestions(false)
        try { collegeInputRef.current?.querySelector("input")?.blur() } catch {}
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
    try { collegeInputRef.current?.querySelector("input")?.blur() } catch {}
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
  // SIMPLE Course dropdown + editable textbox
  // ----------------------------
  const [coursesGroups, setCoursesGroups] = useState([]) // [{ title, items: [] }]
  const [coursesListFlat, setCoursesListFlat] = useState([]) // flat list (A-Z)
  const [courseQuery, setCourseQuery] = useState("") // content in text box (editable)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const courseInputRef = useRef(null)
  const courseDropdownRef = useRef(null)

  useEffect(() => {
    // Build grouped lists from coursesData
    try {
      const json = coursesData || {}
      const groups = []

      // helper: push group if has items
      const pushGroup = (title, arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return
        const cleaned = Array.from(new Set(arr)).filter(Boolean)
        if (cleaned.length) groups.push({ title, items: cleaned })
      }

      // prefer explicit categories in _default
      if (json._default) {
        // map some keys to friendly titles
        const mapping = {
          school_11_12: "School (11 / 12)",
          ug_science: "UG - Science",
          ug_engineering: "UG - Engineering",
          ug_arts_commerce: "UG - Arts & Commerce",
          ug_professional: "UG - Professional",
          pg_common: "PG & Common"
        }
        Object.keys(json._default).forEach((k) => {
          const title = mapping[k] || k.replace(/_/g, " ").toUpperCase()
          pushGroup(title, json._default[k])
        })
      }

      // also include any top-level arrays (like all_courses split groups)
      Object.keys(json).forEach((k) => {
        if (k === "_default" || k === "all_courses") return
        if (Array.isArray(json[k])) {
          const title = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          pushGroup(title, json[k])
        }
      })

      // Fallback: if nothing found, try all_courses
      if (groups.length === 0 && Array.isArray(json.all_courses)) {
        pushGroup("All Courses", json.all_courses)
      }

      // Build flat list for convenience (A-Z)
      const flat = []
      groups.forEach((g) => {
        g.items.forEach((it) => flat.push(it))
      })
      const dedupedFlat = Array.from(new Set(flat)).sort((a, b) => a.localeCompare(b))

      // if still empty fallback to a small set
      if (dedupedFlat.length === 0) {
        const fallback = [
          "B.Sc. (Computer Science)",
          "B.Sc. (Information Technology)",
          "BCA (Bachelor of Computer Applications)",
          "B.Com (General)",
          "B.A. (General)",
          "B.Tech - Computer Science & Engineering",
          "MCA",
          "MBA",
          "BMM (Bachelor of Mass Media)"
        ]
        setCoursesGroups([{ title: "Common Courses", items: fallback }])
        setCoursesListFlat(fallback)
      } else {
        setCoursesGroups(groups)
        setCoursesListFlat(dedupedFlat)
      }
    } catch (err) {
      setCoursesGroups([{ title: "Common Courses", items: ["B.Sc. (Computer Science)", "BCA", "BMM (Bachelor of Mass Media)"] }])
      setCoursesListFlat(["B.Sc. (Computer Science)", "BCA", "BMM (Bachelor of Mass Media)"])
    }
  }, [])

  // open dropdown on focus / click
  const openCourseDropdown = () => {
    setDropdownOpen(true)
  }
  const closeCourseDropdown = () => {
    setDropdownOpen(false)
  }

  // pick from dropdown
  const pickCourseFromDropdown = (name) => {
    const value = name === "Other" ? (courseQuery.trim() || "Other") : name
    setFormData((prev) => ({ ...prev, course: value }))
    setCourseQuery(value)
    setDropdownOpen(false)
    // blur input so keyboard won't re-open it (optional)
    try { courseInputRef.current?.blur() } catch {}
    setErrors((prev) => ({ ...prev, course: undefined }))
  }

  // click outside to close
  useEffect(() => {
    function onDocClick(e) {
      if (courseInputRef.current && !courseInputRef.current.contains(e.target) && courseDropdownRef.current && !courseDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  // When user types in textbox, update formData.course as editable value
  const onCourseTextChange = (e) => {
    const val = e.target.value
    setCourseQuery(val)
    setFormData((prev) => ({ ...prev, course: val }))
    // keep dropdown open so user can still pick if they want
    // (but do not force it)
  }

  // ----------------------------
  // End course logic
  // ----------------------------

  // Phone hint state (show small 1-line popup on focus)
  const [showPhoneHint, setShowPhoneHint] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    let workshopBlankTab = null
    const willOpenWorkshop = formData.category === "workshop" && selectedWorkshopObj?.url
    if (willOpenWorkshop) {
      try {
        workshopBlankTab = window.open("", "_blank")
        if (workshopBlankTab) {
          workshopBlankTab.document.title = "Opening workshop..."
          workshopBlankTab.document.body.innerHTML = "<p style='font-family:system-ui,Arial; font-size:16px; padding:20px;'>Opening workshop — please wait...</p>"
        }
      } catch (err) {
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
        if (workshopBlankTab && !workshopBlankTab.closed) {
          try { workshopBlankTab.close() } catch (e) {}
        }

        setErrors({ submit: data.error || "Failed to submit. Try again." })
        setIsSubmitting(false)
        return
      }

      const registrationId = data?.id || data?.registrationId || data?.insertedId || null

      setSubmitSuccess(true)
      setSubmitMessage(data.message || (formData.category === "workshop" ? "Registration ok — opening workshop..." : "Registration ok — redirecting to payment..."))

      setTimeout(() => {
        if (formData.category === "workshop") {
          const url = selectedWorkshopObj?.url
          if (url) {
            if (workshopBlankTab && !workshopBlankTab.closed) {
              try {
                workshopBlankTab.location.href = url
              } catch (err) {
                window.open(url, "_blank")
              }
            } else {
              try { window.open(url, "_blank") } catch (err) { window.location.href = url }
            }
          }

          try {
            router.push("/Dashboard")
          } catch (err) {
            window.location.href = "/Dashboard"
          }
        } else {
          const params = new URLSearchParams({
            event: formData.registrationType,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone
          })
          if (registrationId) params.set("registrationId", registrationId)

          const paymentUrl = `/payment?${params.toString()}`

          try {
            router.push(paymentUrl)
          } catch (err) {
            window.location.href = paymentUrl
          }
        }
      }, 500)
    } catch (err) {
      console.error("Registration error:", err)
      if (workshopBlankTab && !workshopBlankTab.closed) {
        try { workshopBlankTab.close() } catch (e) {}
      }
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative">
      {submitSuccess && (
        <div className="p-3 md:p-4 bg-cyber-orange/10 border border-cyber-orange/30 rounded-lg">
          <p className="font-poppins text-neon-orange font-semibold mb-1 text-sm md:text-base">Registration received</p>
          <p className="font-poppins text-xs md:text-sm text-muted-text">{submitMessage}</p>
        </div>
      )}

      {errors.submit && (
        <div className="p-2 md:p-3 bg-neon-magenta/10 border border-neon-magenta/30 rounded">
          <p className="font-poppins text-neon-magenta text-sm md:text-base">{errors.submit}</p>
        </div>
      )}

      {/* Basic fields */}
      <div>
        <label htmlFor="fullName" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
          Full Name <span className="text-neon-magenta">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          placeholder="Your name"
          suppressHydrationWarning={true}
        />
        {errors.fullName && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.fullName}</p>}
      </div>

      {/* EMAIL INPUT */}
      <div>
        <label htmlFor="email" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
          Email <span className="text-neon-magenta">*</span>
        </label>

        {signedInEmail ? (
          <>
            <input
              id="email"
              name="email_display"
              type="text"
              value={formData.email}
              readOnly
              aria-readonly="true"
              aria-describedby="emailHelp"
              onFocus={(e) => e.target.select()}
              className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none cursor-default opacity-90"
              suppressHydrationWarning={true}
            />

            <input type="hidden" name="email" value={formData.email} suppressHydrationWarning={true} />

            <p id="emailHelp" className="mt-2 text-xs md:text-sm text-muted-text flex items-center gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" />
              </svg>
              <span className="text-xs md:text-sm">
                Signed in as <strong>{formData.email}</strong> — email is fixed for this registration.
              </span>
            </p>
          </>
        ) : (
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            placeholder="your@email.com"
            suppressHydrationWarning={true}
          />
        )}
        {errors.email && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.email}</p>}
      </div>

      <div className="relative">
        <label htmlFor="phone" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
          Phone <span className="text-neon-magenta">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onFocus={() => setShowPhoneHint(true)}
          onBlur={() => setShowPhoneHint(false)}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          placeholder="+91 XXXXXXXXXX"
          suppressHydrationWarning={true}
        />
        {showPhoneHint && (
          <div className="absolute right-0 top-full mt-2 px-3 py-1 rounded bg-[#ffefdd] text-[#3a2b00] text-xs border border-[#ffdd99] shadow-sm z-50">
            Reachable number
          </div>
        )}
        {errors.phone && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.phone}</p>}
      </div>

      {/* College autocomplete (unchanged) */}
      <div className="relative">
        <label htmlFor="college" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
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
            onFocus={() => {
              if (!collegeQuery.trim() && colleges.length) {
                const all = colleges.map((c, idx) => ({ idx, name: c.name, score: 0 })).slice(0, 50)
                setCollegeSuggestions(all)
                setCollegeShowSuggestions(true)
                setCollegeActiveIndex(-1)
              } else if (collegeSuggestions.length) {
                setCollegeShowSuggestions(true)
              }
            }}
            placeholder="Start typing your college or school name..."
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            aria-autocomplete="list"
            aria-controls="college-listbox"
            aria-expanded={collegeShowSuggestions}
            role="combobox"
            suppressHydrationWarning={true}
          />
        </div>

        <input type="hidden" name="college" value={formData.college} suppressHydrationWarning={true} />

        {errors.college && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.college}</p>}

        {collegeShowSuggestions && collegeSuggestions.length > 0 && (
          <ul
            id="college-listbox"
            ref={collegeSuggestionsRef}
            role="listbox"
            aria-label="College suggestions"
            className="absolute z-50 mt-1 md:mt-2 max-h-40 md:max-h-60 w-full overflow-auto rounded-lg bg-deep-night/95 border border-neon-cyan/20 p-1 shadow-lg"
            suppressHydrationWarning={true}
          >
            {collegeSuggestions.map((s, idx) => (
              <li
                key={s.idx + "-" + idx}
                role="option"
                aria-selected={collegeActiveIndex === idx}
                onMouseDown={(e) => { e.preventDefault(); pickCollege(s.idx) }}
                onMouseEnter={() => setCollegeActiveIndex(idx)}
                className={`px-2 py-1 md:px-3 md:py-2 text-sm md:text-sm cursor-pointer select-none ${collegeActiveIndex === idx ? "bg-neon-cyan/10 text-neon-cyan" : "text-muted-text hover:bg-deep-night/40"}`}
              >
                {s.name} <span className="text-xs md:text-sm text-muted-text"> — {colleges[s.idx]?.city || ''}{colleges[s.idx]?.state ? ', ' + colleges[s.idx].state : ''}</span>
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
                  try { collegeInputRef.current?.querySelector("input")?.blur() } catch {}
                }}
                className="px-2 py-1 md:px-3 md:py-2 text-sm md:text-sm cursor-pointer select-none text-muted-text hover:bg-deep-night/40"
              >
                Use "{collegeQuery.trim()}"
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Course: editable textbox + grouped dropdown */}
      <div className="relative">
        <label htmlFor="course" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
          Course / Stream <span className="text-neon-magenta">*</span>
        </label>

        <div ref={courseInputRef}>
          <input
            id="course"
            name="course_input"
            type="text"
            autoComplete="off"
            value={courseQuery || formData.course}
            onChange={onCourseTextChange}
            onFocus={() => openCourseDropdown()}
            onClick={() => openCourseDropdown()}
            placeholder="Click to choose or type your course (e.g. B.Sc., BMM, BCA…) "
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            suppressHydrationWarning={true}
          />
        </div>

        <input type="hidden" name="course" value={formData.course} suppressHydrationWarning={true} />

        {errors.course && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.course}</p>}

        {dropdownOpen && (
          <div
            ref={courseDropdownRef}
            className="absolute z-50 mt-1 md:mt-2 max-h-72 w-full overflow-auto rounded-lg bg-deep-night/95 border border-neon-cyan/20 p-1 shadow-lg"
            role="listbox"
            aria-label="Course list"
            suppressHydrationWarning={true}
          >
            {coursesGroups.map((g, gi) => (
              <div key={gi} className="mb-2 last:mb-0">
                <div className="px-2 py-1 text-xs md:text-sm font-semibold text-neon-cyan/90">{g.title}</div>
                <ul>
                  {g.items.map((it, ii) => (
                    <li
                      key={gi + "-" + ii}
                      onMouseDown={(e) => { e.preventDefault(); pickCourseFromDropdown(it) }}
                      className="px-3 py-1 md:px-3 md:py-2 text-sm md:text-sm cursor-pointer select-none text-muted-text hover:bg-deep-night/40 rounded"
                      role="option"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="border-t border-neon-cyan/10 mt-1 pt-2">
              <ul>
                <li
                  onMouseDown={(e) => { e.preventDefault(); pickCourseFromDropdown("Other") }}
                  className="px-3 py-1 md:px-3 md:py-2 text-sm md:text-sm cursor-pointer select-none text-muted-text hover:bg-deep-night/40 rounded font-medium"
                  role="option"
                >
                  Other (enter manually)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Event dropdown */}
      <div>
        <label htmlFor="registrationType" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">Choose Event <span className="text-neon-magenta">*</span></label>
        <select
          id="registrationType"
          name="registrationType"
          value={formData.registrationType}
          onChange={(e) => setFormData((prev) => ({ ...prev, registrationType: e.target.value }))}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40"
          suppressHydrationWarning={true}
        >
          <option value="">Select an event...</option>
          {EVENTS.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} {ev.mode === "team" ? "(Team)" : "(Individual)"} - ₹{eventPricing[ev.id] || 0}
            </option>
          ))}
        </select>
        {errors.registrationType && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.registrationType}</p>}

        {selectedEventObj && (
          <div className="mt-2 md:mt-3 p-2 md:p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-sm md:text-base">
            <p className="font-poppins"><span className="font-semibold">Registration Fee:</span> ₹{eventPrice}</p>
          </div>
        )}

        {isTeamEvent && (
          <div className="mt-2 md:mt-3">
            <label htmlFor="teamMembers" className="block font-poppins text-sm md:text-base font-semibold text-neon-cyan mb-2">
              Team Members (Names, comma-separated) <span className="text-neon-magenta">*</span>
            </label>
            <textarea
              id="teamMembers"
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 resize-none"
              placeholder="John Doe, Jane Doe"
              suppressHydrationWarning={true}
            />
            {errors.teamMembers && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.teamMembers}</p>}
          </div>
        )}
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="w-4 h-4 md:w-5 md:h-5 mt-0.5 rounded border-neon-cyan/30 text-neon-cyan bg-deep-night/50 cursor-pointer"
            suppressHydrationWarning={true}
          />
          <span className="font-poppins text-xs md:text-sm text-muted-text group-hover:text-neon-cyan transition-colors">
            I have read and agree to the rules
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-xs md:text-sm text-neon-magenta">{errors.consent}</p>}
      </div>

      <div className="mt-4 md:mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 md:px-5 md:py-3 rounded-lg font-poppins font-semibold bg-neon-cyan text-black disabled:opacity-60 transition text-sm md:text-base"
          suppressHydrationWarning={true}
        >
          {isSubmitting ? "Processing..." : formData.category === "workshop" ? "Proceed to Workshop" : formData.category === "event" ? "Proceed to Payment" : "Register Now"}
        </button>
      </div>
    </form>
  )
}

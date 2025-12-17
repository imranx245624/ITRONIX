"use client"

import { useState } from "react"

export default function RegisterForm({ preselectedEvent, preselectedWorkshop }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    registrationType: preselectedEvent || preselectedWorkshop || "",
    teamMembers: "",
    consent: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const registrationTypes = [
    "Hackathon",
    "Robotics Arena",
    "AI Challenge",
    "Code Sprint",
    "Cyber Arena",
    "AI & ML Bootcamp",
    "IoT & Embedded Systems",
    "Web Dev: From Idea to Launch",
    "General",
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.college.trim()) {
      newErrors.college = "College / Department is required"
    }

    if (!formData.registrationType) {
      newErrors.registrationType = "Please select a registration type"
    }

    if (!formData.consent) {
      newErrors.consent = "You must accept the terms to register"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        setSubmitMessage(
          data.message ||
            `Hi ${formData.fullName}, thank you for registering for ${formData.registrationType}. We will contact you with further details.`,
        )
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          college: "",
          registrationType: "",
          teamMembers: "",
          consent: false,
        })

        // Reset success message after 8 seconds
        setTimeout(() => setSubmitSuccess(false), 8000)
      } else {
        setErrors({ submit: data.error || "Failed to submit registration. Please try again." })
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
      console.error("Registration error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitSuccess && (
        <div className="p-4 bg-cyber-orange/20 border border-cyber-orange/50 rounded-lg">
          <p className="font-poppins text-cyber-orange font-semibold mb-2">Registration Received — ITRONIX-2K26</p>
          <p className="font-poppins text-muted-text text-sm">{submitMessage}</p>
        </div>
      )}

      {errors.submit && (
        <div className="p-4 bg-neon-magenta/20 border border-neon-magenta/50 rounded-lg">
          <p className="font-poppins text-neon-magenta font-semibold">{errors.submit}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Full Name <span className="text-neon-magenta">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
          placeholder="Your name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Email <span className="text-neon-magenta">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Phone <span className="text-neon-magenta">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
          placeholder="+91 XXXXXXXXXX"
        />
        {errors.phone && <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.phone}</p>}
      </div>

      {/* College/Department */}
      <div>
        <label htmlFor="college" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          College / Department <span className="text-neon-magenta">*</span>
        </label>
        <input
          type="text"
          id="college"
          name="college"
          value={formData.college}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
          placeholder="Your college name"
        />
        {errors.college && <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.college}</p>}
      </div>

      {/* Registration Type */}
      <div>
        <label htmlFor="registrationType" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Registration Type <span className="text-neon-magenta">*</span>
        </label>
        <select
          id="registrationType"
          name="registrationType"
          value={formData.registrationType}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="">Select a registration type...</option>
          {registrationTypes.map((type) => (
            <option key={type} value={type} className="bg-deep-night text-muted-text">
              {type}
            </option>
          ))}
        </select>
        {errors.registrationType && (
          <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.registrationType}</p>
        )}
      </div>

      {/* Team Members */}
      <div>
        <label htmlFor="teamMembers" className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">
          Team Members (Names, comma-separated) - Optional
        </label>
        <textarea
          id="teamMembers"
          name="teamMembers"
          value={formData.teamMembers}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-deep-night/50 border border-neon-cyan/30 rounded-lg font-poppins text-muted-text focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200 resize-none"
          placeholder="John Doe, Jane Smith, Alex Johnson"
        />
      </div>

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
            I accept the terms and conditions and agree to use of my data for event communications.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-neon-magenta font-poppins">{errors.consent}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isSubmitting ? "Registering..." : "Register Now"}
      </button>
    </form>
  )
}

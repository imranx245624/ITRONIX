"use client"

import { useEffect, useState } from "react"
// import QRCode from "qrcode"

export default function RegisterForm({ preselectedEvent, preselectedWorkshop }) {
  const [category, setCategory] = useState(preselectedWorkshop ? "workshop" : "event")
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
  const [paymentQRDataUrl, setPaymentQRDataUrl] = useState(null)
  const [paymentLinkId, setPaymentLinkId] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)
  const [checkingPayment, setCheckingPayment] = useState(false)

  // map event name to price (INR)
  const priceMap = {
    Hackathon: 1999,
    "Robotics Arena": 1499,
    "AI Challenge": 1699,
    "Code Sprint": 999,
    "Cyber Arena": 1299,
    "AI & ML Bootcamp": 2499,
    "IoT & Embedded Systems": 1399,
    "Web Dev: From Idea to Launch": 1199,
    General: 499,
  }

  const registrationTypes = Object.keys(priceMap)

  useEffect(() => {
    // if preselected value passed
    if (preselectedWorkshop) setCategory("workshop")
    if (preselectedEvent) setCategory("event")
  }, [preselectedEvent, preselectedWorkshop])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.college.trim()) newErrors.college = "College is required"
    if (!formData.registrationType) newErrors.registrationType = "Please select a registration type"
    if (!formData.consent) newErrors.consent = "You must accept terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Workshop flow -> redirect to sponsor page after saving a "workshop registration (status: redirect)" so you can track.
  const submitWorkshop = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/register-workshop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      })
      const data = await res.json()
      if (res.ok && data.sponsorUrl) {
        // save registration id, then redirect user to sponsor URL to buy
        setSubmitSuccess(true)
        setSubmitMessage("Redirecting you to partner page to complete workshop purchase...")
        // open in new tab and also redirect current tab (safer)
        window.open(data.sponsorUrl, "_blank")
        window.location.assign(data.sponsorUrl)
      } else {
        setErrors({ submit: data.error || "Failed to start workshop flow" })
      }
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Network / server error. Try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Event flow -> create Razorpay payment link server-side, show QR for `short_url`, then verify payment before final save
  const submitEvent = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const amount = priceMap[formData.registrationType] || 500
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, amount }),
      })
      const data = await res.json()
      if (res.ok && data.paymentUrl && data.paymentLinkId && data.registrationId) {
        setPaymentLinkId(data.paymentLinkId)
        setRegistrationId(data.registrationId)
        // generate QR dataURL for paymentUrl
        const qr = await QRCode.toDataURL(data.paymentUrl)
        setPaymentQRDataUrl(qr)
        setSubmitMessage("Scan QR or open link to pay. After payment, click VERIFY PAYMENT.")
        setSubmitSuccess(true)
      } else {
        setErrors({ submit: data.error || "Failed to create payment. Try again." })
      }
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Server error. Try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyPayment = async () => {
    if (!paymentLinkId || !registrationId) {
      setErrors({ submit: "No payment link found to verify." })
      return
    }
    setCheckingPayment(true)
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentLinkId, registrationId }),
      })
      const data = await res.json()
      if (res.ok && data.status === "paid") {
        setSubmitMessage("Payment verified — registration confirmed. Thanks!")
        // clear form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          college: "",
          registrationType: "",
          teamMembers: "",
          consent: false,
        })
        // reset payment UI after success
        setPaymentQRDataUrl(null)
        setPaymentLinkId(null)
        setRegistrationId(null)
        setTimeout(() => setSubmitSuccess(false), 8000)
      } else {
        setErrors({ submit: data.error || "Payment not completed yet. Try again after paying." })
      }
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Verification error. Try again." })
    } finally {
      setCheckingPayment(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (category === "workshop") {
      if (!validateForm()) return
      await submitWorkshop()
    } else {
      // event
      if (!validateForm()) return
      await submitEvent()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* category toggle */}
      <div className="flex gap-4">
        <button type="button" onClick={() => setCategory("event")}
          className={`px-4 py-2 rounded ${category==="event" ? "bg-neon-cyan text-black" : "bg-deep-night/60"}`}>
          Event participation
        </button>
        <button type="button" onClick={() => setCategory("workshop")}
          className={`px-4 py-2 rounded ${category==="workshop" ? "bg-neon-cyan text-black" : "bg-deep-night/60"}`}>
          Workshop (sponsor)
        </button>
      </div>

      {/* rest of form — kept same as your original */}
      {/* Full Name */}
      <div> ...{/* use the exact inputs you already had — omitted here for brevity in this snippet */} </div>

      {/* Registration Type */}
      <div>
        <label className="block font-poppins text-sm font-semibold text-neon-cyan mb-2">Registration Type</label>
        <select name="registrationType" value={formData.registrationType} onChange={handleChange} className="w-full">
          <option value="">Select a registration type...</option>
          {registrationTypes.map((t) => <option key={t} value={t}>{t} — ₹{priceMap[t]}</option>)}
        </select>
        {errors.registrationType && <p className="text-neon-magenta">{errors.registrationType}</p>}
      </div>

      {/* Consent */}
      <div>
        <label>
          <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} /> I accept terms
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full btn-primary">
        {isSubmitting ? "Processing..." : (category === "workshop" ? "Proceed to Workshop" : "Proceed & Pay")}
      </button>

      {/* Payment QR + verify button (only for event flow after link created) */}
      {paymentQRDataUrl && (
        <div className="mt-4 p-4 border rounded">
          <p className="mb-2">Scan QR to pay or open link below:</p>
          <img src={paymentQRDataUrl} alt="payment-qr" className="mx-auto" style={{maxWidth:240}} />
          <p className="break-words"><a href="#" onClick={(ev)=>{ev.preventDefault(); window.open(paymentQRDataUrl,'_blank')}}>Open payment link</a></p>
          <button onClick={handleVerifyPayment} disabled={checkingPayment} className="mt-3 btn-primary">
            {checkingPayment ? "Checking..." : "I have paid — Verify Payment"}
          </button>
        </div>
      )}

      {submitSuccess && <div className="p-3 bg-green-100">{submitMessage}</div>}
      {errors.submit && <div className="p-3 bg-red-100">{errors.submit}</div>}
    </form>
  )
}

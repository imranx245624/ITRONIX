"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef, useMemo } from "react"
import eventPricing from "@/data/eventPricing.json"
import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()

  const event = params.get("event")
  const name = params.get("name")
  const email = params.get("email")
  const phone = params.get("phone")
  const registrationId = params.get("registrationId")

  const amount = eventPricing[event] || 100
  const BUCKET = "payment_screenshots"

  const [showInfoPopup, setShowInfoPopup] = useState(true)

  const normalizeKey = (s = "") =>
    s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const QR_MAP = useMemo(() => {
    const RAW = {
      "web development": "/qr/web.png",
      "e-hack": "/qr/qr-2.png",
      "e-busters": "/qr/qr-3.png",
      "e-golf": "/qr/qr-4.png",
      "e-vibe": "/qr/qr-5.png",
      "e-blind-typing": "/qr/qr-6.png",
      "e-presentation": "/qr/qr-7.png",
      "e-treasure": "/qr/qr-8.png",
      "e-byte": "/qr/qr-9.png",
      "e-bgmi": "/qr/qr-10.png",
      "e-free-fire": "/qr/qr-11.png"
    }
    const map = {}
    Object.keys(RAW).forEach((k) => (map[normalizeKey(k)] = RAW[k]))
    return map
  }, [])

  const normalizedEventKey = normalizeKey(event || "")
  const qrSrc = QR_MAP[normalizedEventKey] || QR_MAP[normalizeKey("web development")] || "/qr/default.png"

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  const [confirmChecked, setConfirmChecked] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  // NEW: step control
  const [showUploadSection, setShowUploadSection] = useState(false)

  const TECH_PHONE = "+91 9905956912"
  const CONTACT_EMAIL = "itronix@gncasc.org"

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const openFilePicker = () => {
    if (uploaded) {
      setError("You've already uploaded a screenshot. Contact us if you need help.")
      return
    }
    setError("")
    inputRef.current?.click()
  }

  const onFileChange = (e) => {
    setError("")
    setMessage("")
    const f = e.target.files?.[0] || null
    if (!f) return
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file (jpg/png/webp).")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.")
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setConfirmChecked(false)
  }

  const sanitizeFileName = (n = "") => n.replace(/\s+/g, "_").replace(/[^\w.\-()]/g, "")

  const downloadQr = async () => {
    try {
      const res = await fetch(qrSrc, { cache: "no-store" })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${normalizeKey(event || "upi-qr")}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      window.open(qrSrc, "_blank")
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!file || !confirmChecked) {
      setError("Please select and confirm screenshot.")
      return
    }

    setUploading(true)
    try {
      const ts = Date.now()
      const safeName = sanitizeFileName(file.name)
      const path = registrationId
        ? `event_${event}/reg_${registrationId}_${ts}_${safeName}`
        : `event_${event}/anon_${ts}_${safeName}`

      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadErr) throw uploadErr

      await fetch("/api/payment/save-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, path, name, email, phone, event, amount })
      })

      setUploaded(true)
      setMessage("Screenshot uploaded successfully.")
      setTimeout(() => router.push("/Dashboard"), 1000)
    } catch {
      setError("Upload failed. Try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      {showInfoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#041014] p-6 rounded-lg max-w-lg">
            <h3 className="text-neon-cyan font-semibold mb-2">Payment Info</h3>
            <p className="text-sm text-muted-text">Use PhonePe / Paytm / GPay only.</p>
            <button onClick={() => setShowInfoPopup(false)} className="mt-4 px-4 py-2 bg-neon-cyan text-black rounded">Proceed</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl border rounded-xl p-4 bg-deep-night/60">
        <h1 className="text-2xl font-bold mb-2">Payment</h1>
        <p className="text-muted-text mb-3">Name: {name} | Email: {email}</p>
        <p className="text-xl text-cyan-400 mb-4">₹{amount}</p>

        {/* STEP 1: QR ONLY */}
        {!showUploadSection && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-56 h-56 bg-white p-2 rounded">
              <img src={qrSrc} alt="QR" className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-3">
              <button onClick={downloadQr} className="px-4 py-2 bg-neon-cyan text-black rounded">Download QR</button>
              <button onClick={() => setShowUploadSection(true)} className="px-4 py-2 border rounded">Next</button>
            </div>
          </div>
        )}

        {/* STEP 2: UPLOAD SECTION */}
        {showUploadSection && (
          <form onSubmit={handleUpload} className="mt-6 space-y-3 ">
            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

            <button type="button" onClick={openFilePicker} className="px-4 py-2 bg-neon-cyan text-black rounded">Choose Screenshot</button>

            {previewUrl && <img src={previewUrl} className="w-40 mt-2 rounded border" />}

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)} />
              I confirm this is correct payment screenshot
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {message && <p className="text-green-400 text-sm">{message}</p>}

            <button type="submit" disabled={uploading} className="w-full py-2 bg-neon-cyan text-black rounded">
              {uploading ? "Uploading..." : "Upload & Submit"}
            </button>

            <p className="text-xs text-muted-text mt-2">Need help? <a href={`mailto:${CONTACT_EMAIL}`} className="underline">Email</a> or call {TECH_PHONE}</p>
          </form>
        )}
      </div>
    </div>
  )
}

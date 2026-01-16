// app/payment/page.jsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef, useMemo } from "react"
import eventPricing from "@/data/eventPricing.json"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function PaymentPage() {
  // router / auth
  const params = useSearchParams()
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  // query params
  const event = params.get("event")
  const name = params.get("name")
  const email = params.get("email")
  const phone = params.get("phone")
  const registrationId = params.get("registrationId") // optional

  const amount = eventPricing[event] || 100
  const BUCKET = "payment_screenshots"

  // popup for payment info
  const [showInfoPopup, setShowInfoPopup] = useState(true)

  // ---------- QR map & normalization ----------
  const normalizeKey = (s = "") =>
    s
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

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
      "e-free-fire": "/qr/qr-11.png",
    }
    const map = {}
    Object.keys(RAW).forEach((k) => (map[normalizeKey(k)] = RAW[k]))
    return map
  }, [])

  const normalizedEventKey = normalizeKey(event || "")
  const qrSrc =
    QR_MAP[normalizedEventKey] || QR_MAP[normalizeKey("web development")] || "/qr/default.png"

  // ---------- state ----------
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  // require sign-in (Clerk)
  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) router.push("/sign-in")
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // ---------- file picker ----------
  const openFilePicker = () => {
    setError("")
    inputRef.current?.click()
  }

  const onFileChange = (e) => {
    setError("")
    const f = e.target.files?.[0] || null
    if (!f) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
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
  }

  const sanitizeFileName = (n) => n.replace(/\s+/g, "_").replace(/[^\w.\-()]/g, "")

  // ---------- download QR helper ----------
  const downloadQr = async () => {
    try {
      const res = await fetch(qrSrc, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch")
      const blob = await res.blob()
      const ext = (blob.type && blob.type.split("/").pop()) || "png"
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${normalizeKey(event || "upi-qr")}.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      try {
        window.open(qrSrc, "_blank")
      } catch {
        window.location.href = qrSrc
      }
    }
  }

  // ---------- upload handler ----------
  const handleUpload = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    if (!file) {
      setError("Please select a screenshot to upload.")
      return
    }

    if (!isSignedIn) {
      setError("You must be signed in to save the screenshot. Please sign in and retry.")
      return
    }

    setUploading(true)
    try {
      const ts = Date.now()
      const safeName = sanitizeFileName(file.name)
      const path = registrationId
        ? `event_${event}/reg_${registrationId}_${ts}_${safeName}`
        : `event_${event}/anon_${ts}_${safeName}`

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadErr) {
        console.error("Supabase upload error:", uploadErr)
        setError("Upload failed. Try again.")
        setUploading(false)
        return
      }

      const pubResp = supabase.storage.from(BUCKET).getPublicUrl(path)
      const publicURL =
        (pubResp && (pubResp.publicURL || pubResp.publicUrl)) ||
        (pubResp?.data && (pubResp.data.publicUrl || pubResp.data.publicURL)) ||
        ""

      const payload = {
        registrationId: registrationId || null,
        path,
        publicURL,
        name,
        email,
        phone,
        event,
        amount,
      }

      const res = await fetch("/api/payment/save-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let json
      try {
        json = await res.json()
      } catch (err) {
        console.error("Invalid JSON from server:", err)
        setError("Server response invalid. Check console.")
        setUploading(false)
        return
      }

      if (!res.ok) {
        console.error("Server confirm error:", json)
        setError(json?.error || "Uploaded but failed to save record. Contact admin.")
        setUploading(false)
        return
      }

      setMessage("Screenshot uploaded and saved. We'll verify and confirm your registration.")
      setUploading(false)
      setTimeout(() => router.push("/Dashboard"), 1000)
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("Unexpected error. Try again.")
      setUploading(false)
    }
  }

  // ---------- helper: skip / pay at venue ----------
  const handleSkip = () => {
    // redirect to events page or events with query param
    const target = event ? `/events?event=${encodeURIComponent(event)}` : "/events"
    router.push(target)
  }

  // ---------- UI ----------
  return (
    <div className="z-1 min-h-screen h-240 flex items-center justify-center bg-black text-white p-4 md:p-6">
      {/* INFO POPUP: appears on top of page, responsive */}
      {showInfoPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInfoPopup(false)}
            aria-hidden="true"
          />

          <div
            className="relative z-70 w-full max-w-2xl mx-auto rounded-xl"
            style={{ border: "2px solid rgba(255,150,50,0.95)" }} /* border-cyber-orange */
          >
            <div className="bg-[#041014]/98 rounded-lg overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/6">
                <div>
                  <h3 className="text-sm md:text-lg font-semibold text-neon-cyan">Payment options — Important</h3>
                  <p className="text-xs md:text-sm text-muted-text mt-1">
                    You can pay using the UPI QR codes below via these supported apps.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* <button
                    type="button"
                    onClick={() => setShowInfoPopup(false)}
                    aria-label="Close payment info"
                    className="px-3 py-1 rounded bg-black/20 hover:opacity-90 text-sm"
                  >
                    ✕
                  </button> */}
                </div>
              </div>

              {/* body */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-text mb-3">
                    <strong>Acceptable apps:</strong> You can pay using only <strong>PhonePe, Paytm, or Google Pay</strong> (UPI) — these are accepted for verification.
                  </p>

                  <div className="flex items-center gap-3">
                    {/* logos (small) */}
                    <img
                      src="images/phonepay.jpg"
                      alt="PhonePe"
                      className="w-12 h-12 object-contain rounded bg-white/5 p-1"
                    />
                    <img
                      src="/images/paytm.jpg"
                      alt="Paytm"
                      className="w-12 h-12 object-contain rounded bg-white/5 p-1"
                    />
                    <img
                      src="/images/googlepay.jpg"
                      alt="Google Pay"
                      className="w-12 h-12 object-contain rounded bg-white/5 p-1"
                    />
                  </div>

                  <p className="text-xs text-muted-text mt-3">
                   ⚠️ If you pay using any other app, verification might fail — in that case you can pay at the venue (choose <strong>Skip</strong> below).
                  </p>
                </div>

                {/* QR preview box (small) */}
                {/* <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-deep-night/60 border border-white/5">
                  <div className="w-32 h-32 bg-white p-1 rounded-md flex items-center justify-center">
                    <img src={qrSrc} alt="QR preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs text-muted-text">Scan to pay</div>
                </div> */}
              </div>

              {/* footer actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 md:p-5 border-t border-white/6 bg-transparent">
                <button
                  type="button"
                  onClick={() => setShowInfoPopup(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-cyan text-black font-semibold"
                >
                  Proceed to Pay
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-transparent border border-white/8 text-sm text-muted-text hover:bg-white/3"
                >
                  Skip (Pay at venue)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full relative max-w-3xl rounded-xl border p-4 md:p-6 bg-deep-night/60">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Payment</h1>
        <p className="text-sm md:text-base text-muted-text mb-2">
          Name: {name || "-"}
          <br />
          Email: {email || "-"}
        </p>
        <p className="text-lg md:text-2xl text-cyan-400 font-semibold mb-4">₹{amount}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QR area */}
          <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
            <p className="text-xs md:text-sm mb-1">Scan QR to pay via UPI</p>

            <div className="w-44 h-44 md:w-56 md:h-56 bg-white p-1 rounded-md flex items-center justify-center">
              <img src={qrSrc} alt="QR code" className="max-w-full max-h-full object-contain" />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={downloadQr}
                className="px-4 py-2 text-sm rounded-md bg-neon-cyan text-black font-semibold"
              >
                Download
              </button>
            </div>
          </div>

          {/* Upload */}
          <div className="p-3 border rounded-lg flex flex-col">
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Upload payment screenshot (jpg/png/webp)</label>

                <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="px-3 py-2 rounded-md bg-neon-cyan text-black font-semibold text-sm"
                  >
                    Choose File
                  </button>
                  <div className="text-sm">
                    {file ? <span className="text-sm text-muted-text">{file.name}</span> : <span className="text-sm text-neon-magenta">No file chosen</span>}
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-xs mb-1">Preview:</p>
                    <img src={previewUrl} alt="preview" className="w-36 md:w-48 h-auto rounded-md border" />
                  </div>
                )}

                {error && <p className="text-sm text-neon-magenta">{error}</p>}
                {message && <p className="text-sm text-neon-cyan">{message}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className={`w-full py-2 rounded-lg font-semibold text-sm ${uploading || !file ? "opacity-60 cursor-not-allowed" : "bg-neon-cyan text-black"}`}
                >
                  {uploading ? "Uploading..." : "Upload Screenshot & Save"}
                </button>
              </div>
            </form>

            <div className="mt-2 text-xs text-muted-text">
              <p>Make sure your UPI transaction shows the correct reference/amount. We'll verify and confirm registration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// app/payment/page.jsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import eventPricing from "@/data/eventPricing.json"
import { supabase } from "@/lib/supabase"
import { useUser, SignInButton } from "@clerk/nextjs"

 /**
  * PaymentPage
  * - Enforces Clerk sign-in (redirects to sign-in if not signed in)
  * - Uploads screenshot to Supabase storage (existing flow)
  * - Calls server endpoint /api/payment/save-screenshot which uses the service role to update DB
  */

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  const event = params.get("event")
  const name = params.get("name")
  const email = params.get("email")
  const phone = params.get("phone")
  const registrationId = params.get("registrationId") // optional

  const amount = eventPricing[event] || 100
  const BUCKET = "payment_screenshots"

  const QR_MAP = {
    "e-bgmi": "/QRcodes/QR1.jpeg",
    "e-free-fire": "/qr/freefire.png",
    "e-ludo": "/qr/ludo.png",
    "e-blind-typing": "/qr/blind-typing.png",
    "web development": "/qr/web.png",
    "e-vibe": "/qr/vibe.png",
    "e-golf": "/qr/golf.png",
    "e-busters": "/qr/bug-busters.png",
    "e-hack": "/qr/hackathon.png",
    "e-Treasure": "/qr/treasure.png",
    "e-byte": "/qr/byte.png",
    "e-presentation": "/qr/presentation.png"
  }

  const qrSrc = QR_MAP[event] || "/qr/default.png"

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  // ------------- require sign-in (Clerk) -------------
  useEffect(() => {
    // Wait until Clerk finishes loading
    if (!isLoaded) return
    if (!isSignedIn) {
      // redirect to your sign-in page (adjust path if you use a different page)
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const openFilePicker = () => {
    setError("")
    if (inputRef.current) inputRef.current.click()
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
      setError("Please select an image file (jpg/png).")
      return
    }
    if (f.size > 10 * 1024 * 1024) { // 10MB limit (adjust)
      setError("File too large. Max 10MB.")
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
  }

  const sanitizeFileName = (n) => {
    return n.replace(/\s+/g, "_").replace(/[^\w.\-()]/g, "")
  }

  // ---------- copy/save functions (moved inside so qrSrc is available) ----------
  const copyImage = async () => {
    if (!qrSrc) {
      alert("No QR available to copy")
      return
    }

    // Prefer copying the binary image to clipboard (modern browsers)
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API not available")
      // ClipboardItem required for binary paste
      if (typeof ClipboardItem === "undefined") throw new Error("ClipboardItem not supported")

      const res = await fetch(qrSrc, { mode: "cors" })
      const blob = await res.blob()
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
      alert("QR image copied to clipboard")
      return
    } catch (err) {
      // fallback: copy URL as text
      try {
        await navigator.clipboard.writeText(qrSrc)
        alert("QR image URL copied to clipboard (binary copy not supported)")
      } catch (err2) {
        console.warn("Both copy attempts failed:", err, err2)
        alert("Copy not supported on this browser")
      }
    }
  }

  const saveImage = () => {
    if (!qrSrc) {
      alert("No QR available to save")
      return
    }
    try {
      const link = document.createElement("a")
      link.href = qrSrc
      const inferredName = (qrSrc.split("/").pop() || "qr-code").split("?")[0]
      link.download = inferredName.includes(".") ? inferredName : "upi-qr.png"
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Save image error:", err)
      // last-resort open in new tab
      window.open(qrSrc, "_blank")
    }
  }
  // -------------------------------------------------------------------------------

  const handleUpload = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    if (!file) {
      setError("Please select a screenshot to upload.")
      return
    }

    // Ensure Clerk user is signed in
    if (!isSignedIn) {
      setError("You must be signed in to save the screenshot. Please sign in and retry.")
      return
    }

    setUploading(true)
    try {
      const ts = Date.now()
      const safeName = sanitizeFileName(file.name)
      // Put registrationId in filename if available (helps traceability)
      const path = registrationId
        ? `event_${event}/reg_${registrationId}_${ts}_${safeName}`
        : `event_${event}/anon_${ts}_${safeName}`

      // Upload to storage (client-side) - this uses your existing supabase client (anon key)
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        })

      if (uploadErr) {
        console.error("Supabase upload error:", uploadErr)
        setError("Upload failed. Try again.")
        setUploading(false)
        return
      }

      // get public url (if bucket public) or compose path for server
      const pubResp = supabase.storage.from(BUCKET).getPublicUrl(path)
      const publicURL =
        (pubResp && (pubResp.publicURL || pubResp.publicUrl)) ||
        (pubResp?.data && (pubResp.data.publicUrl || pubResp.data.publicURL)) ||
        ""

      // Now call server endpoint to update DB using service role (bypass RLS)
      // This endpoint will run on the server and use SUPABASE_SERVICE_ROLE_KEY
      const payload = {
        registrationId: registrationId || null,
        path,
        publicURL,
        name,
        email,
        phone,
        event,
        amount
      }

      const res = await fetch("/api/payment/save-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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

  return (
    <div className="z-1 min-h-screen flex items-center justify-center bg-black text-white p-6 backdrop-blur-sm relative top-1 h-250 w-full max-h-1xl">
      <div className="w-full max-w-3xl rounded-xl border p-6 bg-deep-night/60">
        <h1 className="text-2xl font-bold mb-2">Payment — {event || "Event"}</h1>
        <p className="text-sm text-muted-text mb-3">Name: {name} <br/> Email:{email}</p>
        <p className="text-lg text-cyan-400 font-semibold mb-6">₹{amount}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR */}
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <p className="text-sm mb-1">Scan QR to pay via UPI</p>

            <div className="w-56 h-56 bg-white p-2 rounded-md flex items-center justify-center">
              <img
                src={qrSrc}
                alt="QR code"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* small buttons under QR */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={copyImage}
                className="px-3 py-1 text-xs rounded-md border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
              >
                Copy
              </button>

              <button
                type="button"
                onClick={saveImage}
                className="px-3 py-1 text-xs rounded-md border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
              >
                Save
              </button>
            </div>
          </div>

          {/* Upload */}
          <div className="p-4 border rounded-lg flex flex-col">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Upload payment screenshot (jpg/png/webp)</label>

                <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

                <div className="flex gap-3 items-center">
                  <button type="button" onClick={openFilePicker} className="px-4 py-2 rounded-md bg-neon-cyan text-black font-semibold">Choose File</button>
                  <div className="text-sm">
                    {file ? <span className="text-sm text-muted-text">{file.name}</span> : <span className="text-sm text-neon-magenta">No file chosen</span>}
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-xs mb-1">Preview:</p>
                    <img src={previewUrl} alt="preview" className="w-48 h-auto rounded-md border" />
                  </div>
                )}

                {error && <p className="text-sm text-neon-magenta">{error}</p>}
                {message && <p className="text-sm text-neon-cyan">{message}</p>}
              </div>

              <div>
                <button type="submit" disabled={uploading || !file} className={`w-full py-3 rounded-lg font-semibold ${uploading || !file ? "opacity-60 cursor-not-allowed" : "bg-neon-cyan text-black"}`}>
                  {uploading ? "Uploading..." : "Upload Screenshot & Save"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-xs text-muted-text">
              <p>Note: Make sure your UPI transaction shows the correct reference/amount. We will verify and confirm your registration.</p>
              {/* <p className="mt-2">Bucket: <strong>{BUCKET}</strong> • DB column: <strong>payment_screenshot_url</strong></p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

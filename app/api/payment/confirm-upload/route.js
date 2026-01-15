// app/api/payment/confirm-upload/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs" // ensure node runtime

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase service role key or url in env")
  // note: don't throw at import time if you prefer — we still check below.
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/*
  Expected JSON:
  {
    "registrationId": "<uuid>"   OR "email": "user@example.com",
    "publicURL": "https://...."
  }
*/

export async function POST(req) {
  try {
    const body = await req.json()
    const { registrationId, publicURL, email } = body || {}

    if (!publicURL) {
      return NextResponse.json({ success: false, error: "publicURL required" }, { status: 400 })
    }
    if (!registrationId && !email) {
      return NextResponse.json({ success: false, error: "registrationId or email required" }, { status: 400 })
    }

    // Build update object
    const updates = {
      payment_screenshot_url: publicURL,
      payment_status: "submitted",
      payment_submitted_at: new Date().toISOString()
    }

    let resp
    if (registrationId) {
      resp = await admin
        .from("registrations")
        .update(updates)
        .eq("id", registrationId)
        .select("id,email,payment_status")
        .limit(1)
    } else {
      // fallback: update most-recent by email
      resp = await admin
        .from("registrations")
        .update(updates)
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .select("id,email,payment_status")
    }

    if (resp.error) {
      console.error("Admin update error:", resp.error)
      return NextResponse.json({ success: false, error: "DB update failed", details: resp.error }, { status: 500 })
    }

    if (!resp.data || resp.data.length === 0) {
      return NextResponse.json({ success: false, warning: "No row matched to update" }, { status: 200 })
    }

    return NextResponse.json({ success: true, updated: resp.data[0] })
  } catch (err) {
    console.error("confirm-upload route error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

// app/api/save-screenshot/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPA_URL || !SUPA_SERVICE_KEY) {
  // during build this file may execute — guard with helpful error
  console.error("Missing Supabase service credentials in env")
}

const supabaseAdmin = createClient(SUPA_URL, SUPA_SERVICE_KEY)

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      registrationId,
      email,
      event,
      path,
      publicURL
    } = body || {}

    if (!path || !publicURL) {
      return NextResponse.json({ error: "Missing path/publicURL" }, { status: 400 })
    }

    // If registrationId given -> update that row
    if (registrationId) {
      const { error: updErr, data: updData } = await supabaseAdmin
        .from("registrations")
        .update({
          payment_screenshot_url: publicURL,
          payment_screenshot_path: path,
          payment_submitted_at: new Date().toISOString(),
          payment_status: "submitted"
        })
        .eq("id", registrationId)
        .select("id")
        .limit(1)

      if (updErr) {
        console.error("admin update error:", updErr)
        return NextResponse.json({ error: "DB update failed", details: updErr }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: updData?.[0] || null })
    }

    // Fallback: no registrationId -> create a new minimal registration row (if you want)
    const { data: ins, error: insErr } = await supabaseAdmin
      .from("registrations")
      .insert([
        {
          full_name: null,
          email: email || null,
          phone: null,
          category: "event",
          registration_type: event || null,
          amount: null,
          payment_screenshot_url: publicURL,
          payment_screenshot_path: path,
          payment_status: "submitted",
          created_at: new Date().toISOString(),
          payment_submitted_at: new Date().toISOString()
        }
      ])
      .select("id")
      .limit(1)

    if (insErr) {
      console.error("admin insert error:", insErr)
      return NextResponse.json({ error: "DB insert failed", details: insErr }, { status: 500 })
    }

    return NextResponse.json({ success: true, inserted: ins?.[0] || null })
  } catch (err) {
    console.error("save-screenshot route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

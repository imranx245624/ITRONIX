// app/api/save-screenshot/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function getSupabaseAdmin() {
  if (!SUPA_URL || !SUPA_SERVICE_KEY) {
    throw new Error("Supabase service credentials missing")
  }
  return createClient(SUPA_URL, SUPA_SERVICE_KEY)
}

export async function POST(req) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const body = await req.json()
    const {
      registrationId,
      email,
      event,
      path,
      publicURL
    } = body || {}

    if (!path || !publicURL) {
      return NextResponse.json(
        { error: "Missing path or publicURL" },
        { status: 400 }
      )
    }

    // 🔁 UPDATE EXISTING REGISTRATION
    if (registrationId) {
      const { data, error } = await supabaseAdmin
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

      if (error) {
        console.error("Supabase update error:", error)
        return NextResponse.json(
          { error: "DB update failed" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        updated: data?.[0] || null
      })
    }

    // ➕ INSERT NEW REGISTRATION (fallback)
    const { data, error } = await supabaseAdmin
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

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "DB insert failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      inserted: data?.[0] || null
    })

  } catch (err) {
    console.error("save-screenshot API error:", err.message)
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }
}

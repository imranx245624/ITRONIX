// app/api/register/route.js
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// server-side supabase (service role) - safe on server only
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function POST(req) {
  try {
    const body = await req.json()

    // ensure some server-managed defaults
    const payload = {
      ...body,
      payment_status: body.payment_status || "pending",
      created_at: body.created_at || new Date().toISOString()
    }

    // insert and return id
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .insert([payload])
      .select("id")
      .single()

    if (error) {
      console.error("Register insert error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error("Register route error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

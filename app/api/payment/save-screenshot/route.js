// // app/api/payment/save-screenshot/route.js
// import { NextResponse } from "next/server"
// import { createClient } from "@supabase/supabase-js"

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
// const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
//   // when building the server, throw later; but here we let handler return 500
// }

// const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
//   auth: { persistSession: false }
// })

// export async function POST(req) {
//   try {
//     const body = await req.json()
//     const { registrationId, path, publicURL, email } = body || {}

//     if (!path) {
//       return NextResponse.json({ error: "Missing 'path' in request" }, { status: 400 })
//     }
//     if (!registrationId && !email) {
//       return NextResponse.json({ error: "Provide registrationId or email to match registration" }, { status: 400 })
//     }

//     // Build update payload
//     const updates = {
//       payment_screenshot_url: publicURL || null,
//       payment_screenshot_path: path,
//       payment_status: "submitted",
//       payment_submitted_at: new Date().toISOString()
//     }

//     // Update by registrationId if available, else try by email (most recent)
//     let res
//     if (registrationId) {
//       res = await adminSupabase
//         .from("registrations")
//         .update(updates)
//         .eq("id", registrationId)
//     } else {
//       // match by email (most recent)
//       res = await adminSupabase
//         .from("registrations")
//         .update(updates)
//         .eq("email", email)
//         .order("created_at", { ascending: false })
//         .limit(1)
//     }

//     if (res.error) {
//       console.error("Service-role DB update error:", res.error)
//       return NextResponse.json({ error: res.error.message || "DB update failed" }, { status: 500 })
//     }

//     return NextResponse.json({ success: true, updated: res.data })
//   } catch (err) {
//     console.error("save-screenshot route error:", err)
//     return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
//   }
// }
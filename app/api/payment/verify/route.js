// app/api/payment/verify/route.js
import crypto from "crypto"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Payment verify endpoint
 * - Expects JSON body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, email? , registrationId? }
 * - Verifies signature with RAZORPAY_KEY_SECRET
 * - Updates registrations table: payment_status = 'paid', payment_id = <...>, payment_verified_at = now()
 * - Uses SUPABASE_SERVICE_ROLE_KEY (or fallback SUPABASE_ANON_KEY if that's all you have) to update safely
 */

// ---- env / supabase init (safe) ----
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY /* keep explicit */ ||
  process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in env.")
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ---- handler ----
export async function POST(req) {
  try {
    const body = await req.json()

    // Basic validation
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, registrationId } = body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment fields" }, { status: 400 })
    }

    const razorSecret = process.env.RAZORPAY_KEY_SECRET
    if (!razorSecret) {
      console.error("RAZORPAY_KEY_SECRET not set in env")
      return NextResponse.json({ success: false, error: "Server misconfiguration" }, { status: 500 })
    }

    // Compute expected signature
    const expected = crypto
      .createHmac("sha256", razorSecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (expected !== razorpay_signature) {
      console.warn("Payment signature mismatch", { expected, got: razorpay_signature, order: razorpay_order_id })
      // Optionally log to a table for investigation
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 })
    }

    // Signature ok -> update registration(s)
    // Prefer updating by razorpay_order_id (server generated and stored). Fallback to email or registrationId.
    const updates = {
      payment_status: "paid",
      payment_id: razorpay_payment_id,
      payment_verified_at: new Date().toISOString(),
      razorpay_order_id: razorpay_order_id,
    }

    // 1) Try by razorpay_order_id
    let { error: updErr, data: updData } = await supabase
      .from("registrations")
      .update(updates)
      .eq("razorpay_order_id", razorpay_order_id)
      .select("id,email,razorpay_order_id,payment_status")
      .limit(1)

    if (updErr) {
      console.error("Supabase update (by order_id) error:", updErr)
      // continue to try fallback; but keep note
    }

    // 2) If no rows updated (updData empty), try by registrationId if provided
    if ((!updData || updData.length === 0) && registrationId) {
      const res = await supabase
        .from("registrations")
        .update(updates)
        .eq("id", registrationId)
        .select("id,email,razorpay_order_id,payment_status")
        .limit(1)
      if (res.error) {
        console.error("Supabase update (by registrationId) error:", res.error)
      } else {
        updData = res.data
        updErr = res.error
      }
    }

    // 3) Fallback: try update by email if still nothing
    if ((!updData || updData.length === 0) && email) {
      const res = await supabase
        .from("registrations")
        .update(updates)
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .select("id,email,razorpay_order_id,payment_status")
      if (res.error) {
        console.error("Supabase update (by email) error:", res.error)
      } else {
        updData = res.data
        updErr = res.error
      }
    }

    if (updErr) {
      // DB error occurred
      return NextResponse.json({ success: false, error: "Database update failed" }, { status: 500 })
    }

    if (!updData || updData.length === 0) {
      // No registration matched — still return success (or return 404 if you prefer)
      console.warn("No registration record matched for order/payment", { razorpay_order_id, email, registrationId })
      // Optionally: create a log row in a payments table for manual reconciliation
      return NextResponse.json({ success: true, warning: "Payment verified but no registration matched. Please reconcile manually." })
    }

    // Success
    console.log("Payment verified & registration updated:", { updated: updData[0] })
    return NextResponse.json({ success: true, registration: updData[0] })
  } catch (err) {
    console.error("Verify route error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

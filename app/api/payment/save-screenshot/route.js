// app/api/payment/save-screenshot/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Lazy factory for a server-side Supabase client.
 * - Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_KEY.
 * - Memoized on globalThis to avoid re-creating on each request in the same instance.
 */
function getAdminSupabase() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return null; // caller will handle missing envs gracefully
  }

  // Memoize the client on the global object (safe for server runtimes)
  if (!globalThis.__supabase_admin_client) {
    globalThis.__supabase_admin_client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }

  return globalThis.__supabase_admin_client;
}

export async function POST(req) {
  try {
    const adminSupabase = getAdminSupabase();
    if (!adminSupabase) {
      console.error("Supabase env vars missing: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY not set.");
      return NextResponse.json(
        { error: "Supabase env vars missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) in environment." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const { registrationId, path, publicURL, email } = body || {};

    if (!path) {
      return NextResponse.json({ error: "Missing 'path' in request" }, { status: 400 });
    }
    if (!registrationId && !email) {
      return NextResponse.json({ error: "Provide registrationId or email to match registration" }, { status: 400 });
    }

    // Build update payload
    const updates = {
      payment_screenshot_url: publicURL || null,
      payment_screenshot_path: path,
      payment_status: "submitted",
      payment_submitted_at: new Date().toISOString(),
    };

    // Update flow:
    // - If registrationId provided -> update that record directly
    // - Else -> find most recent registration by email, then update by id
    let updatedRows = null;

    if (registrationId) {
      const { data, error } = await adminSupabase
        .from("registrations")
        .update(updates)
        .eq("id", registrationId)
        .select(); // return updated rows

      if (error) {
        console.error("DB update error (by id):", error);
        return NextResponse.json({ error: error.message || "DB update failed" }, { status: 500 });
      }

      updatedRows = data;
    } else {
      // find most recent registration with this email
      const { data: found, error: findError } = await adminSupabase
        .from("registrations")
        .select("id")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1);

      if (findError) {
        console.error("DB find error (by email):", findError);
        return NextResponse.json({ error: findError.message || "DB lookup failed" }, { status: 500 });
      }

      if (!found || found.length === 0) {
        return NextResponse.json({ error: "No registration found for provided email" }, { status: 404 });
      }

      const targetId = found[0].id;
      const { data: updated, error: updateError } = await adminSupabase
        .from("registrations")
        .update(updates)
        .eq("id", targetId)
        .select();

      if (updateError) {
        console.error("DB update error (by email->id):", updateError);
        return NextResponse.json({ error: updateError.message || "DB update failed" }, { status: 500 });
      }

      updatedRows = updated;
    }

    return NextResponse.json({ success: true, updated: updatedRows }, { status: 200 });
  } catch (err) {
    console.error("save-screenshot route uncaught error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

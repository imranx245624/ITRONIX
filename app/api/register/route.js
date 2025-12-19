import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const body = await req.json()

    const { error } = await supabase
      .from("registrations")   // ⚠️ table name same hona chahiye
      .insert([body])

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    )
  }
}

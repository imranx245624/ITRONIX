import { NextResponse } from "next/server"

// TODO: Replace with actual database (Supabase, MongoDB, etc.)
let allRegistrations = []

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "email parameter required", registrations: [] },
        { status: 200 }
      )
    }

    // TODO: Query your actual database
    // Example Supabase:
    // const { data } = await supabase
    //   .from('registrations')
    //   .select('*')
    //   .eq('email', email)
    //   .order('created_at', { ascending: false })

    // For now, filter in-memory store
    const userRegs = allRegistrations
      .filter((r) => r.email === email)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return NextResponse.json({ registrations: userRegs }, { status: 200 })
  } catch (err) {
    console.error("Registrations GET error:", err)
    return NextResponse.json(
      { error: "Failed to fetch registrations", registrations: [] },
      { status: 200 }
    )
  }
}

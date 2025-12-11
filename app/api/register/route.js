import { NextResponse } from "next/server"

async function sendEmail(to, subject, text) {
  // If SendGrid API key is not configured, log and return false (fallback)
  if (!process.env.SENDGRID_API_KEY) {
    console.log("[Email Fallback] Email service not configured. Email details:", {
      to,
      subject,
      text,
    })
    return false
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject,
          },
        ],
        from: {
          email: "itronix@gurunanak.edu.in",
          name: "ITRONIX-2K26 Team",
        },
        content: [
          {
            type: "text/plain",
            value: text,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error("[SendGrid Error] Failed to send email:", await response.text())
      return false
    }

    console.log("[SendGrid] Email sent successfully to:", to)
    return true
  } catch (error) {
    console.error("[SendGrid Error]", error)
    return false
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.fullName || !body.email || !body.phone || !body.college || !body.registrationType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!body.consent) {
      return NextResponse.json({ error: "You must accept the terms to register" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Log registration
    console.log("[ITRONIX Registration]", {
      timestamp: new Date().toISOString(),
      registration: body,
    })

    const participantEmailText = `Hi ${body.fullName},

Thank you for registering for ${body.registrationType} at ITRONIX-2K26!

Registration Details:
- Event/Workshop: ${body.registrationType}
- Phone: ${body.phone}
- College: ${body.college}
${body.teamMembers ? `- Team Members: ${body.teamMembers}` : ""}

We will contact you with further details soon. Keep an eye on your inbox for updates!

Event Dates: 20–22 March 2026
Location: Guru Nanak College, GTB Nagar, Mumbai

For any queries, contact us at itronix@gurunanak.edu.in

— ITRONIX-2K26 Team`

    await sendEmail(body.email, "Registration Received — ITRONIX-2K26", participantEmailText)

    const adminEmailText = `New ITRONIX-2K26 Registration

Name: ${body.fullName}
Email: ${body.email}
Phone: ${body.phone}
College: ${body.college}
Event/Workshop: ${body.registrationType}
${body.teamMembers ? `Team Members: ${body.teamMembers}` : "Solo Registration"}

Registration Time: ${new Date().toISOString()}`

    await sendEmail(
      "itronix@gurunanak.edu.in",
      `New Registration: ${body.fullName} — ${body.registrationType}`,
      adminEmailText,
    )

    return NextResponse.json(
      {
        success: true,
        message: `Hi ${body.fullName}, thank you for registering for ${body.registrationType}. We will contact you with further details.`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

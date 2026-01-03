// components/ai/festBrain.js
// ITRONIX fest "brain" — knowledge base + simple matcher
// - Exports FEST_KNOWLEDGE, normalizeText, getBestReply (and default export getBestReply)
// - Use **bold** markup for emphasis in replies (your UI renders that)

// ---------- Knowledge base ----------
export const FEST_KNOWLEDGE = [
  // Friendly greetings / persona (so assistant starts friendly)
  {
    id: "greeting",
    q: ["hi", "hello", "hey", "hiya", "greetings", "namaste", "yo","hy brother"],
    a:
      "Hi! 👋 I'm **ITRONIX Assistant** — your fest helper. Ask me about dates, registration, events, payments, workshops, or college info. Example: **'How to register?'** or **'When is the fest?'**",
  },
  {
    id: "thanks",
    q: ["thanks", "thank you", "thx", "thanks!"],
    a: "You're welcome! If you need more details—ask anything about the fest or college.",
  },
  {
    id: "bye",
    q: ["bye", "goodbye", "see you", "later"],
    a: "Bye! Good luck — and drop by the ITRONIX assistant if you need more help.",
  },

  // Core fest items (kept & polished)
  {
    id: "dates",
    q: ["when", "date", "schedule", "time", "fest date"],
    a:
      "ITRONIX 2026 is on **23 & 24 January 2026**. Registrations are going on.",
  },
  {
    id: "registration",
    q: ["register", "registration", "sign up", "how to register"],
    a:
    "Rgeistration will start soon. Stay tuned for updates on our official websites and social media channels.", 
    // "Go to the **Events** page, choose an event, open its details and click **Register**. Paid events require uploading payment screenshot on the Payment page. Team events need comma-separated team member names.",
  },
  {
    id: "payment",
    q: ["payment", "screenshot", "upload", "payment screenshot", "pay"],
    a:
      "After payment, upload the screenshot on the payment page. Make sure the amount and reference are clearly visible — the team will verify it before confirming registration.",
  },
  {
    id: "workshops",
    q: ["workshop", "workshops", "ws", "bootcamp"],
    a:
      "Workshops normally include Web Dev, AI/ML, IoT and Robotics. Check the **Workshops** page for available sessions and fees — seats may be limited.",
  },
  {
    id: "team",
    q: ["team", "team size", "team members"],
    a:
      "Team events require comma-separated team member names during registration. Team size is shown in each event's details — check the event card for exact limits.",
  },
  {
    id: "rules",
    q: ["rules", "guidelines", "policy", "terms", "format"],
    a:
      "Follow event-specific rules shown on event pages. General code of conduct: be fair, respectful and follow submission formats. Read each event's 'Rules & Format' before participating.",
  },

  // College-specific info (name, address, contact, websites, map)
  {
    id: "college_name",
    q: ["college", "which college", "what college", "college name", "gnc"],
    a:
      "This fest is organized by **Guru Nanak College of Arts, Science & Commerce (GTB Nagar)** — a well-known college in Mumbai under Guru Nanak Vidyak Society.",
  },

  {
    id: "college_address",
    q: ["address", "location", "where is the college", "gtb", "gtb nagar", "sion"],
    a:
      "Guru Nanak College (G.T.B. Nagar) address: **Guru Tegh Bahadur Nagar (G.T.B. Nagar), Mumbai - 400037**. For directions open Google Maps and search 'Guru Nanak College GTB Nagar Mumbai'.",
  },

  // {
  //   id: "college_contact",
  //   q: ["phone", "contact number", "telephone", "call", "contact us", "email", "principal","contact"],
  //   a:
    
  //     // "College contact: **Phone**: +91 93217 34389 (other numbers listed: +91 90761 11622 / office lines 022-24071098). **Email (general/office):** admin@gurunanakcollegeasc.in — For principal: principal@gurunanakcollegeasc.in.",
  // },

  {
    id: "college_website",
    q: ["website", "site", "official site", "college website", "gncasc", "gurunanakcollegeasc"],
    a:
      "Official websites: **https://www.gurunanakcollegeasc.in/** and **https://gncasc.org/** — use these for official announcements, admission notices and contact details.",
  },

  {
    id: "college_map",
    q: ["map", "google map", "directions", "how to reach", "nearest station"],
    a:
      "Directions: Guru Nanak College is in G.T.B. Nagar (Sion area). Nearest railway: Kings Circle / Sion area; nearest bus stops serve G.T.B. Nagar. Open Google Maps and search: **'Guru Nanak College GTB Nagar Mumbai'** for turn-by-turn directions.",
  },

  // B.Sc. (Information Technology) specific
  {
    id: "bsc_it",
    q: ["bsc it", "b.sc it", "bsc information technology", "bsc it syllabus", "it course", "bsc it course"],
    a:
      "Guru Nanak College offers **B.Sc. (Information Technology)** — a 3-year UG programme . See the college 'B.Sc (Information Technology)' page or syllabus PDF for credit structure and subjects.",
  },

  // Contact person / tech head quick (fest team)
  {
    id: "fest_contact",
    q: ["organizer","contact", "technical head", "who to contact", "fest contact", "itronix contact","phone", "contact number", "telephone", "call", "contact us", "email"],
    a:
      "For technical or fest help contact the Technical Head imran ali - +91 9905956912 or email: Itronix@gncasc.org",
  },

  // Default / fallback
  {
    id: "default",
    q: [],
    a:
      "I answer only ITRONIX fest & Guru Nanak College related questions (dates, registration, events, payments, workshops, college info). Try: **'When is the fest?'**, **'How to register?'**, **'B.Sc. IT syllabus'**, or **'College address'**.",
  },
]

// ---------- Helpers ----------
export function normalizeText(s = "") {
  return s
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * getBestReply(message, knowledge = FEST_KNOWLEDGE)
 * - simple keyword scoring (phrase includes, token match)
 * - returns best match (falls back to default)
 */
export function getBestReply(message = "", knowledge = FEST_KNOWLEDGE) {
  const text = normalizeText(String(message || ""))
  if (!text) return "Please type a question about the fest or college (e.g., 'When is the fest?')."

  const tokens = text.split(" ").filter(Boolean)
  let best = knowledge.find((k) => k.id === "default")
  let bestScore = 0

  for (const item of knowledge) {
    if (item.id === "default") continue
    let score = 0

    // phrase matching (if any keyword phrase is substring)
    for (const kw of item.q) {
      const n = normalizeText(kw)
      if (!n) continue
      if (text.includes(n)) score += 3
      if (tokens.includes(n)) score += 1
    }

    // little bonus if first word matches one of the keywords
    if (item.q.some((q) => text.startsWith(q))) score += 1

    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  // fallback token match (looser)
  if (bestScore === 0) {
    for (const item of knowledge) {
      if (item.id === "default") continue
      for (const kw of item.q) {
        if (tokens.includes(normalizeText(kw))) {
          best = item
          bestScore = 1
          break
        }
      }
      if (bestScore) break
    }
  }

  if (!best) best = knowledge.find((k) => k.id === "default")
  return best.a
}

export default getBestReply

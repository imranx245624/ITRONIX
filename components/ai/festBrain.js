// components/ai/festBrain.js
// ITRONIX fest "brain" — knowledge base + simple matcher
// - Exports FEST_KNOWLEDGE, normalizeText, getBestReply (and default export getBestReply)
// - Each knowledge item includes: id, q (keywords/phrases), a (reply), and type (question category).
// - Use **bold** markup for emphasis in replies (your UI renders that)

// ---------- Knowledge base ----------
export const FEST_KNOWLEDGE = [
  // Persona / greetings
  {
    id: "greeting",
    type: "meta",
    q: ["hi", "hello", "hey", "hiya", "greetings", "namaste", "yo", "hy brother", "hey bro"],
    a:
      "Hi! 👋 I'm **ITRONIX Assistant** — your fest helper. Ask me about dates, registration, events, payments, workshops, or college info. Example: **'How to register?'** or **'When is the fest?'**",
  },
  {
    id: "thanks",
    type: "meta",
    q: ["thanks", "thank you", "thx", "thanks!"],
    a: "You're welcome! If you need more details—ask anything about the fest or college.",
  },
  {
    id: "bye",
    type: "meta",
    q: ["bye", "goodbye", "see you", "later", "ttyl"],
    a: "Bye! Good luck — and drop by the ITRONIX assistant if you need more help.",
  },

  // Dates / schedule / basic logistics
  {
    id: "dates",
    type: "faq",
    q: ["when", "date", "schedule", "time", "fest date", "when is the fest", "dates"],
    a:
      "ITRONIX 2026 is on **23 & 24 January 2026**. Registrations are open — check the **Events** and **Workshops** pages for individual event timings and venues.",
  },

  // Registration flow
  {
    id: "registration",
    type: "how-to",
    q: ["register", "registration", "sign up", "how to register", "how do i register", "register for event"],
    a:
      "To register: 1) Open the **Events** page and choose the event you want. 2) Open the event details and click **Register**. 3) For paid events, complete payment and upload the payment screenshot on the **Payment** page. Team events require comma-separated member names during registration. If you face issues, mention the event name and I can guide step-by-step.",
  },

  // Payment
  {
    id: "payment",
    type: "how-to",
    q: ["payment", "screenshot", "upload", "payment screenshot", "pay", "how to pay"],
    a:
      "After paying (UPI / specified mode), upload the screenshot on the **Payment** page. Ensure the transaction amount and UPI reference are clearly visible. The organizing team will verify the screenshot before confirming the registration.",
  },

  // Workshops overview
  {
    id: "workshops",
    type: "faq",
    q: ["workshop", "workshops", "ws", "bootcamp", "workshop list"],
    a:
      "Workshops at ITRONIX typically include Web Dev, AI/ML, and IoT. Each workshop lists duration, level and fee on the **Workshops** page. Seats are limited — register early to secure your spot.",
  },

  // Team info
  {
    id: "team",
    type: "faq",
    q: ["team", "team size", "team members", "team registration", "how many members"],
    a:
      "Team size varies by event and is shown on the event details. During registration, provide comma-separated names of team members where required. If a team member is not registered, registration may be invalid — check event rules.",
  },

  // Overall rules (new)
  {
    id: "overall_rules",
    type: "rules",
    q: ["overall rules", "general rules", "all events rules", "fest rules", "guidelines"],
    a:
      "**Overall Rules for All Events:**\n\n• All participants must strictly adhere to the rules and guidelines specified for their respective events.\n• Any misconduct, use of unfair means or violation of event rules will result in immediate disqualification.\n• Report to the event venue on time; late entry may not be permitted.\n• Judges' and coordinators' decisions are final and binding.\n• Carry a valid college ID and present it when asked.\n• Use of prohibited materials or external assistance (including AI tools where restricted) is not allowed unless explicitly permitted.\n• Any damage to college property will be taken seriously and the participant(s) responsible will be held liable.\n• The organizing committee may modify rules, schedules, or venues if required.\n• Maintain respectful conduct toward judges, coordinators, volunteers and fellow participants.\n• Winners will receive cash prizes, trophies and certificates as announced.\n• Students from any degree program with basic IT knowledge are eligible unless specified otherwise.",
  },

  // Event: Web Development
  {
    id: "web_development",
    type: "event",
    q: ["web development", "web dev", "web-development", "web development event", "web dev event", "webdev"],
    a:
      "**Web Development** — A live competition to design and build a responsive landing page using HTML, CSS and JavaScript on an on-the-spot topic.\n\nJudging Criteria: **Design & appearance**, **Clarity of content**, **Creativity**, **Responsiveness**, and **Proper use of HTML/CSS/JS**.\nElimination Condition: **Use of AI tools or AI-generated code will lead to direct disqualification.**\nParticipation: **Individual**.\nVenue: 2nd floor computer lab.\nRegistration Fee: **₹50 per participant.**",
  },

  // Event: Bug Busters
  {
    id: "bug_busters",
    type: "event",
    q: ["bug busters", "bug-busters", "bug buster", "debugging", "debug"],
    a:
      "**Bug Busters** — A hands-on debugging competition where participants identify and fix errors in given programs under time constraints.\n\nJudging Criteria: **Number of bugs fixed**, **Solution accuracy**, **Code efficiency**, **Readability**, and **Time taken**.\nElimination Condition: Any **plagiarism, malpractice, or rule violation (including use of internet or AI tools)** will lead to disqualification.\nParticipation: **Individual**.\nVenue: 2nd floor computer lab.\nRegistration Fee: **₹50 per participant.**",
  },

  // Event: Code Golf
  {
    id: "code_golf",
    type: "event",
    q: ["code golf", "code-golf", "golf", "minify code", "shortest code"],
    a:
      "**Code Golf** — Solve a problem using the minimum number of characters. Focus is on logic, creativity and efficient language use.\n\nJudging Criteria: **Correctness**, **Shortest code length (characters)**, **Efficient use of language features**, and **Earliest valid submission in case of tie**.\nElimination Condition: Incorrect outputs, use of comments, plagiarism, external help or internet access will lead to disqualification.\nParticipation: **Individual**.\nVenue: 2nd floor computer lab.\nRegistration Fee: **₹50 per participant.**",
  },

  // Event: Vibe Coding
  {
    id: "vibe_coding",
    type: "event",
    q: ["vibe coding", "vibe-coding", "vibe", "ai coding", "ai-based coding", "ai tools competition"],
    a:
      "**Vibe Coding** — An innovative competition where participants may use AI tools to design creative, practical web-based solutions on a common topic.\n\nJudging Criteria: **Problem understanding**, **Effective use of AI tools**, **Creativity**, **Originality**, **Practical usefulness**, and **Clarity of explanation**.\nElimination Condition: Plagiarism, idea duplication, unfair means or rule violations will result in disqualification.\nParticipation: **Individual**.\nVenue: 3rd floor computer lab.\nRegistration Fee: **₹50 per participant.**",
  },

  // Event: Blind Typing
  {
    id: "blind_typing",
    type: "event",
    q: ["blind typing", "blind-typing", "typing contest", "typing speed", "wpm contest"],
    a:
      "**Blind Typing** — Type a given paragraph with the monitor switched off to test speed and accuracy.\n\nJudging Criteria: **Typing speed (WPM)** and **Accuracy**.\nElimination Condition: Use of unfair means or violation of rules will lead to disqualification.\nParticipation: **Individual**.\nVenue: 3rd floor computer lab.\nRegistration Fee: **₹50 per participant.**",
  },

  // Event: BGMI Tournament
  {
    id: "bgmi_tournament",
    type: "event",
    q: ["bgmi", "bgmi tournament", "bgmi event", "bgmi game", "esports bgmi"],
    a:
      "**BGMI Tournament** — Competitive BGMI esports tournament where teams battle across rounds to earn points (placement & kills).\n\nJudging Criteria: **Placement points**, **Kill points**, and **Overall performance**.\nElimination Condition: Round 1 teams not in the Top 8 will be eliminated; further eliminations based on total points.\nParticipation: **Team (maximum 4 members)**.\nVenue: Classroom 309.\nRegistration Fee: **₹200 per team.**",
  },

  // Event: Free Fire
  {
    id: "free_fire",
    type: "event",
    q: ["free fire", "free-fire", "freefire", "free fire tournament", "esports free fire"],
    a:
      "**Free Fire** — A high-intensity Battle Royale where squad teams compete in custom rooms across multiple rounds.\n\nJudging Criteria: **Total points from placements and kills across rounds**.\nElimination Condition: Use of hacks, mod APKs, scripts, emulators, teaming, glitches, or any unfair play will result in immediate disqualification.\nParticipation: **Team (squad of 4 players)**.\nVenue: Room 206.\nRegistration Fee: **₹100 per team.**",
  },

  // Event: TechSlides Arena (presentations)
  {
    id: "techslides_arena",
    type: "event",
    q: ["techslides", "techslides arena", "presentation", "presentations", "slides arena", "techslides arena event"],
    a:
      "**TechSlides Arena** — A time-bound presentation competition where participants create and present slides on an on-the-spot technical topic.\n\nJudging Criteria: **Slide design & creativity**, **Clarity of content**, **Depth of topic understanding**, **Presentation delivery**, and **Overall impact**.\nElimination Condition: Copied/plagiarized presentations, incorrect/irrelevant content, exceeding time limits or rule violations will lead to disqualification.\nParticipation: **Team (maximum 2 members)**.\nVenue: 3rd floor computer lab.\nRegistration Fee: **₹40 per team.**",
  },

  // Event: Treasure Hunt
  {
    id: "treasure_hunt",
    type: "event",
    q: ["treasure hunt", "treasure-hunt", "hunt", "campus hunt", "treasure"],
    a:
      "**Treasure Hunt** — Team-based adventure where participants solve clues and navigate the campus to find the final treasure.\n\nJudging Criteria: **Overall points after completing the hunt**; in case of tie, the first to finish wins.\nElimination Condition: Teams failing to complete the hunt or using external assistance will be disqualified.\nParticipation: **Team (maximum 4 members)**.\nStarting Point / Venue: 3rd floor. \nRegistration Fee: **₹50 per team.**",
  },

  // Tech / College info (contact, website, address)
  {
    id: "college_name",
    type: "info",
    q: ["college", "which college", "what college", "college name", "gnc", "which college is this"],
    a:
      "This fest is organized by **Guru Nanak College of Arts, Science & Commerce (G.T.B. Nagar)** — a well-known college in Mumbai under the Guru Nanak Vidyak Society.",
  },

  {
    id: "college_address",
    type: "info",
    q: ["address", "location", "where is the college", "gtb", "gtb nagar", "sion", "college location"],
    a:
      "Guru Nanak College (G.T.B. Nagar) address: **Guru Tegh Bahadur Nagar (G.T.B. Nagar), Mumbai - 400037**. For directions, search 'Guru Nanak College GTB Nagar Mumbai' on Google Maps.",
  },

  {
    id: "college_website",
    type: "info",
    q: ["website", "site", "official site", "college website", "gncasc", "gurunanakcollegeasc"],
    a:
      "Official websites: **https://www.gurunanakcollegeasc.in/** and **https://gncasc.org/** — check them for official announcements and notices.",
  },

  {
    id: "fest_contact",
    type: "contact",
    q: ["organizer", "contact", "technical head", "who to contact", "fest contact", "itronix contact", "phone", "contact number", "telephone", "call", "email"],
    a:
      "For technical or fest help contact the Technical Head **Imran Ali** at **+91 9905956912** or email: **Itronix@gncasc.org**.",
  },

  // B.Sc. IT info
  {
    id: "bsc_it",
    type: "info",
    q: ["bsc it", "b.sc it", "bsc information technology", "bsc it syllabus", "it course", "bsc it course"],
    a:
      "Guru Nanak College offers **B.Sc. (Information Technology)** — a 3-year undergraduate programme. For syllabus and subjects, refer to the college's B.Sc. IT page or syllabus PDF on the official site.",
  },

  // Fallback
  {
    id: "default",
    type: "fallback",
    q: [],
    a:
      "I answer ITRONIX fest & Guru Nanak College related questions (dates, registration, events, payments, workshops, rules, contact). Try: **'When is the fest?'**, **'How to register?'**, **'Web Development event details'**, or **'College address'**.",
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
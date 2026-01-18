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
    q: ["hi", "hello", "hey", "hiya", "greetings", "namaste", "yo", "hey bro", "hi bro", "hello bro"],
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
    q: ["when", "date", "schedule", "time", "fest date", "when is the fest", "dates", "day", "which day"],
    a:
      "ITRONIX 2026 is on **23 January 2026**. All main events and competitions happen on that day — check the **Events** page for the detailed timings and venues for each event.",
  },

  // Registration flow (step-by-step)
  {
    id: "registration",
    type: "how-to",
    q: ["register", "registration", "sign up", "how to register", "how do i register", "register for event", "signup"],
    a:
      "How to register: 1) Click **Register** on the event or homepage. 2) Sign in / Sign up using your  email . 3) Fill the registration form (name, phone, college, course). 4) For paid events, make payment and upload the screenshot on the **Payment** page. or either pay at the venue. But do whole process.  5) Wait for verification and confirmation. If it's a team event, add comma-separated team member names during registration.",
  },

  // Payment (general)
  {
    id: "payment",
    type: "how-to",
    q: ["payment", "screenshot", "upload", "payment screenshot", "how to pay", "pay", "payment options"],
    a:
      "Payment instructions: Use the UPI QR code on the **Payment** page and pay via **PhonePe, Paytm, or Google Pay**. After paying, upload a clear screenshot showing transaction amount and UPI reference. The organizing team will verify and confirm your registration. If verification fails, you'll be asked to re-check or pay at the venue.",
  },

  // Payment: accepted apps / warnings
  {
    id: "payment_apps",
    type: "faq",
    q: ["phonepe", "paytm", "google pay", "gpay", "accept", "which apps", "upi apps"],
    a:
      "Accepted UPI apps for smooth verification: **PhonePe, Paytm, Google Pay**. If you use other apps, verification might fail because screenshots may have different formats — in that case you can pay at the venue instead.",
  },

  // Payment: single upload / precautions
  {
    id: "payment_precautions",
    type: "faq",
    q: ["upload once", "one upload", "only once", "screenshot rules", "wrong screenshot", "precaution", "fraud", "fake screenshot"],
    a:
      "Important: **Upload only once** the correct screenshot — it should clearly show the payer, amount, UPI reference and timestamp. Avoid editing/combining images. If you upload an incorrect screenshot, contact the tech team (ITRONIX contact) immediately. Repeated or tampered screenshots may lead to rejection.",
  },

  // Workshops overview
  {
    id: "workshops",
    type: "faq",
    q: ["workshop", "workshops", "ws", "bootcamp", "workshop list", "workshop details"],
    a:
      "NOT Available for this fest. Stay tuned to the website and social pages for future workshop announcements.",
  },

  // Team info
  {
    id: "team",
    type: "faq",
    q: ["team", "team size", "team members", "team registration", "how many members", "team limit"],
    a:
      "Team sizes depend on the event; check the event details. During registration provide team member names as comma-separated values. All team members should register where required — otherwise the team may become ineligible.",
  },

  // Overall rules & conduct
  {
    id: "overall_rules",
    type: "rules",
    q: ["overall rules", "general rules", "all events rules", "fest rules", "guidelines", "code of conduct"],
    a:
      "**Overall Rules:**\n\n• Follow the event-specific rules listed on each event page.\n• No plagiarism, no outside help, no AI-assisted answers where disallowed.\n• Carry college ID and be on time.\n• Judges' decisions are final.\n• Respect volunteers and judges. Misconduct = disqualification.\n• The committee may change rules/schedule; updates announced on the website.",
  },

  // Specific event entries (common events)
  
  // bug_busters :

{
  id: "bug_busters_overview",
  type: "event",
  q: ["bug busters", "bug-busters", "bug buster", "bugbusters", "debugging contest", "debugging competition", "what is bug busters"],
  a:
    "**Bug Busters** — A hands-on debugging competition where participants identify and fix errors in given programs within a limited time. Problems focus on logic, edge-case handling, runtime errors and incorrect outputs.",
},

{
  id: "bug_busters_time",
  type: "event",
  q: ["bug busters time", "what time bug busters", "start time bug busters", "when is bug busters", "bug busters schedule"],
  a:
    "**Start time:** **11:00 AM** on the main fest day (23 January). Please arrive 15 minutes early for seat allocation. \n(Check the Events page for last-minute timing updates.)",
},

{
  id: "bug_busters_venue",
  type: "event",
  q: ["bug busters venue", "where bug busters", "location bug busters", "room for bug busters"],
  a:
    "**Venue:** 3rd floor computer lab. Look for signboards on the day — volunteers will guide you from the registration desk.",
},

{
  id: "bug_busters_fee",
  type: "event",
  q: ["bug busters fee", "registration fee bug busters", "how much bug busters registration","fee bug busters","bug busters cost","bug busters price", "bug busters charges", "bug busters payment" , "how much to pay bug busters","bug busters payment amount",""],
  a:
    "Registration fee: ₹35 per participant. Pay using the UPI QR on the Payment page and upload the screenshot for verification.",
},

{
  id: "bug_busters_participation",
  type: "event",
  q: ["bug busters team or individual", "is bug busters team event", "participation bug busters"],
  a:
    "Participation: Individual. Each participant registers separately.",
},

{
  id: "bug_busters_allowed_languages",
  type: "event",
  q: ["languages allowed bug busters", "which languages bug busters", "bug busters languages"],
  a:
    "**Allowed languages:** Python, C, C++, Java (use your preferred language). Make sure your code compiles/runs locally — internet access is not allowed during the contest.",
},

{
  id: "bug_busters_format_duration",
  type: "event",
  q: ["bug busters format", "duration bug busters", "how long bug busters", "rounds bug busters"],
  a:
    "Format & duration:  timed rounds (approx 30 minutes). You will receive a set of problems containing buggy programs — fix them so they produce correct output on provided test cases.",
},

{
  id: "bug_busters_judging",
  type: "event",
  q: ["how bug busters judged", "judging criteria bug busters", "score bug busters"],
  a:
    "Judging criteria: Number of bugs correctly fixed (primary), solution accuracy (passes test cases), code efficiency, readability/clarity of fixes, and time taken. Faster correct fixes rank higher in tie-breakers.",
},

{
  id: "bug_busters_disqualification",
  type: "event",
  q: ["disqualified bug busters", "disqualification bug busters", "rules bug busters cheating"],
  a:
    "Elimination / disqualification: Any form of plagiarism, use of internet or external help, sharing answers, use of AI/code-generation tools, or tampering with submissions will lead to immediate disqualification.",
},

{
  id: "bug_busters_tips",
  type: "event",
  q: ["tips bug busters", "how to prepare bug busters", "strategy bug busters", "hacks bug busters"],
  a:
    "Tips: Read each problem fully before editing code; run simple custom tests locally; prioritize problems you can fix fastest; write small, well-commented changes; test edge cases; save early and avoid over-editing; keep an eye on time.",
},

{
  id: "bug_busters_submission",
  type: "event",
  q: ["submit bug busters", "how to submit bug busters solution", "submission bug busters"],
  a:
    "Submission is via the in-room system or as instructed by the proctor (follow on-screen steps). Ensure your final code compiles and passes the sample tests before final submission. Ask volunteers if unsure about submission steps.",
},

{
  id: "bug_busters_contact",
  type: "event",
  q: ["bug busters contact", "who to contact bug busters", "help bug busters"],
  a:
    "For event-specific issues contact the event coordinator or the Technical Head Imran (+91 9905956912). For payment/registration connect to same number",
}


//code golf
,
 {
  id: "code_golf_overview",
  type: "event",
  q: ["code golf", "code-golf", "golf", "shortest code", "what is code golf", "codegolf"],
  a:
    "**Code Golf** — A competitive coding event where participants solve one or more problems using the **minimum number of characters** in their source code. Focus is on concise, clever solutions while keeping output correct.",
},

{
  id: "code_golf_time",
  type: "event",
  q: ["code golf time", "what time code golf", "start time code golf", "when is code golf", "code golf schedule"],
  a:
    "**Start time:** **12:00 PM** on the fest day (23 January). Please arrive 10–15 minutes early to get your seat and environment ready.",
},

{
  id: "code_golf_venue",
  type: "event",
  q: ["code golf venue", "where code golf", "location code golf", "room for code golf", "where is code golf held"],
  a:
    "**Venue:** 2nd floor computer lab. Look for signboards and volunteers at the registration desk for directions.",
},

{
  id: "code_golf_fee",
  type: "event",
  q: ["code golf fee", "registration fee code golf", "how much code golf registration", "code golf cost", "code golf price"],
  a:
    "**Registration fee:** ₹30 per participant. Use the Payment page UPI QR and upload the screenshot for verification to confirm your spot.",
},

{
  id: "code_golf_participation",
  type: "event",
  q: ["code golf team or individual", "is code golf team event", "participation code golf", "individual or team code golf"],
  a:
    "**Participation:** Individual. Each competitor registers separately and competes on their own machine/account.",
},

{
  id: "code_golf_allowed_languages",
  type: "event",
  q: ["languages allowed code golf", "which languages code golf", "code golf languages", "allowed language code golf"],
  a:
    "**Allowed languages:** Any common programming language is allowed (for example: **Python, JavaScript/Node, C, C++, Java**). Confirm exact allowed languages at the start if organizers announce restrictions.",
},

{
  id: "code_golf_format_duration",
  type: "event",
  q: ["code golf format", "duration code golf", "how long code golf", "rounds code golf", "code golf structure"],
  a:
    "**Format & duration:** Timed round(s). Typical single session ~**60 minutes** (organizers may vary). You will be given problems where the objective is correct output using the fewest characters — shorter valid submissions score better.",
},

{
  id: "code_golf_judging",
  type: "event",
  q: ["how code golf judged", "judging criteria code golf", "score code golf", "code golf scoring"],
  a:
    "**Judging criteria:** Primary — **Shortest working code (characters)** that produces correct output across test cases. Secondary — correctness (must pass all tests), efficient use of language features, and earliest valid submission used as tiebreaker.",
},

{
  id: "code_golf_disqualification",
  type: "event",
  q: ["disqualified code golf", "code golf cheating", "rules code golf", "code golf plagiarism"],
  a:
    "**Elimination / disqualification:** Use of prohibited libraries, internet or external help during the contest, plagiarism, sharing answers, or tampering with submissions will lead to immediate disqualification. Comments that reveal external code or copy-paste from internet may also be penalized.",
},

{
  id: "code_golf_tips",
  type: "event",
  q: ["tips code golf", "how to prepare code golf", "strategy code golf", "code golf hacks", "how to win code golf"],
  a:
    "**Tips:** Practice idiomatic short patterns in chosen language (e.g., lambda/one-liners in Python), favour built-ins, avoid verbose variable names, test on edge cases, prefer concise I/O methods. Submit often — earliest shortest valid submission wins tie-breaks. Keep readability where it doesn't cost characters for quick debugging.",
},

{
  id: "code_golf_submission",
  type: "event",
  q: ["submit code golf", "how to submit code golf", "submission code golf", "code golf upload"],
  a:
    "Submission is via the proctor/in-room system (or as instructed by the organizers). Make sure your code runs locally and passes sample tests before final submission. Do not include explanatory comments that could be treated as external code — ask volunteers if unsure about the submission process.",
},

{
  id: "code_golf_contact",
  type: "event",
  q: ["code golf contact", "who to contact code golf", "help code golf", "organizer code golf"],
  a:
    "For event-specific help contact the event coordinator or Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues, send your registration id/email and screenshot to **itronix@gncasc.org**.",
}
,


// vibe_coding
  {
  id: "vibe_coding_overview",
  type: "event",
  q: [
    "vibe coding",
    "vibe-coding",
    "vibe",
    "ai coding",
    "ai-based coding",
    "vibe coding event",
    "what is vibe coding",
    "vibe coding overview"
  ],
  a:
    "**Vibe Coding** — A fast-paced, innovative competition where participants use multiple AI tools (e.g., ChatGPT, v0.app, Cursor, Gemini/Cloud AI) to rapidly design and build a practical web-based prototype on a shared theme. Focus: **prompt engineering**, tool orchestration, and delivering a functional prototype with minimal manual coding.",
},

{
  id: "vibe_coding_time",
  type: "event",
  q: [
    "vibe coding time",
    "what time vibe coding",
    "start time vibe coding",
    "when is vibe coding",
    "vibe coding schedule"
  ],
  a:
    "**Start time:** **9:00 AM** on the fest day (23 January). Arrive 10–15 minutes early for setup and briefing.",
},

{
  id: "vibe_coding_venue",
  type: "event",
  q: [
    "vibe coding venue",
    "where vibe coding",
    "location vibe coding",
    "room for vibe coding",
    "where is vibe coding held"
  ],
  a:
    "**Venue:** 2nd floor computer lab. Look for the ITRONIX signboards and coordinators at the registration desk for directions.",
},

{
  id: "vibe_coding_fee",
  type: "event",
  q: [
    "vibe coding fee",
    "registration fee vibe coding",
    "how much vibe coding registration",
    "vibe coding cost",
    "vibe coding price"
  ],
  a:
    "**Registration fee:** ₹100 per participant. Pay via the Payment page UPI QR and upload the screenshot for verification to confirm your seat.",
},

{
  id: "vibe_coding_participation",
  type: "event",
  q: [
    "vibe coding team or individual",
    "is vibe coding team event",
    "participation vibe coding",
    "individual or team vibe coding"
  ],
  a:
    "**Participation:** Individual. Each person must register separately and submit their own prototype and explanation.",
},

{
  id: "vibe_coding_allowed_tools",
  type: "event",
  q: [
    "which tools allowed vibe coding",
    "allowed tools vibe coding",
    "can i use chatgpt in vibe coding",
    "ai tools allowed vibe coding",
    "v0.app cursor gemini allowed"
  ],
  a:
    "**Allowed tools:** Multiple AI assistants and tools are allowed (examples: **ChatGPT**, **v0.app**, **Cursor**, **Gemini/Cloud AI**, prompt-engineering tools). Use of external internet resources for copying full solutions is not allowed — focus on tool orchestration and original work.",
},

{
  id: "vibe_coding_format_duration",
  type: "event",
  q: [
    "vibe coding format",
    "duration vibe coding",
    "how long vibe coding",
    "rounds vibe coding",
    "vibe coding structure"
  ],
  a:
    "**Format & duration:** Timed single round (typically **90–120 minutes**). You will be given a central theme/challenge — build and demo a working web prototype that leverages AI tools to solve the problem. Expect a short demo + explanation at the end.",
},

{
  id: "vibe_coding_judging",
  type: "event",
  q: [
    "how vibe coding judged",
    "judging criteria vibe coding",
    "score vibe coding",
    "vibe coding judging"
  ],
  a:
    "**Judging criteria:** Problem understanding, **effective use of AI tools**, creativity, originality, practical usefulness of the prototype, and clarity of explanation/demonstration. Judges value **tool orchestration** and how well prompts & outputs are used to build a real solution.",
},

{
  id: "vibe_coding_disqualification",
  type: "event",
  q: [
    "disqualified vibe coding",
    "vibe coding cheating",
    "rules vibe coding",
    "vibe coding plagiarism",
    "idea duplication vibe coding"
  ],
  a:
    "**Elimination / disqualification:** Any form of plagiarism, idea duplication, copying another team's work, external collaboration, or violation of rules will lead to immediate disqualification. Misuse of paid/unauthorised services to fetch complete solutions is not allowed.",
},

{
  id: "vibe_coding_tips",
  type: "event",
  q: [
    "tips vibe coding",
    "how to prepare vibe coding",
    "strategy vibe coding",
    "vibe coding hacks",
    "prompting tips vibe coding"
  ],
  a:
    "**Tips:** Prepare short, focused prompts; design a simple MVP before adding bells; keep prompts reproducible (save them); use a fallback manual solution in case a tool fails; focus on user value and demo clarity; document key prompts and a brief rationale for judges.",
},

{
  id: "vibe_coding_submission",
  type: "event",
  q: [
    "submit vibe coding",
    "how to submit vibe coding",
    "vibe coding submission",
    "demo vibe coding"
  ],
  a:
    "Submission: Demo your working prototype to the judges at the scheduled demo time and provide any required links or short writeups (as instructed). Include key prompts and a short explanation of your tool workflow. Follow on-screen directions given by coordinators.",
},

{
  id: "vibe_coding_contact",
  type: "event",
  q: [
    "vibe coding contact",
    "who to contact vibe coding",
    "help vibe coding",
    "organizer vibe coding"
  ],
  a:
    "For event-specific queries contact the event coordinator or Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues, share your registration id/email and screenshot with **itronix@gncasc.org**.",
}
,

// blind typing
  {
  id: "blind_typing_overview",
  type: "event",
  q: [
    "blind typing",
    "blind-typing",
    "typing contest",
    "typing speed",
    "wpm contest",
    "what is blind typing",
    "blind typing overview"
  ],
  a:
    "**Blind Typing** — A non-technical skill competition where participants type a given paragraph **with the monitor switched off**. The event tests speed (WPM), accuracy, and muscle memory under time pressure.",
},

{
  id: "blind_typing_time",
  type: "event",
  q: [
    "blind typing time",
    "what time blind typing",
    "start time blind typing",
    "when is blind typing",
    "blind typing schedule"
  ],
  a:
    "**Start time:** **10:00 AM** on the fest day (23 January). Please arrive 10–15 minutes early for seating and instructions.",
},

{
  id: "blind_typing_venue",
  type: "event",
  q: [
    "blind typing venue",
    "where blind typing",
    "location blind typing",
    "room for blind typing",
    "where is blind typing held"
  ],
  a:
    "**Venue:** 3rd floor computer lab. Look for signboards and volunteers at the registration desk for directions.",
},

{
  id: "blind_typing_fee",
  type: "event",
  q: [
    "blind typing fee",
    "registration fee blind typing",
    "how much blind typing registration",
    "blind typing cost",
    "blind typing price"
  ],
  a:
    "**Registration fee:** ₹20 per participant. Pay via the Payment page UPI QR and upload the screenshot for verification to confirm your spot.",
},

{
  id: "blind_typing_participation",
  type: "event",
  q: [
    "blind typing team or individual",
    "is blind typing team event",
    "participation blind typing",
    "individual or team blind typing"
  ],
  a:
    "**Participation:** Individual. Each participant competes alone and must register separately.",
},

{
  id: "blind_typing_judging",
  type: "event",
  q: [
    "how blind typing judged",
    "judging blind typing",
    "wpm blind typing",
    "accuracy blind typing",
    "blind typing scoring"
  ],
  a:
    "**Judging criteria:** Typing speed (words per minute) and **accuracy**. Rankings favour high WPM with minimal errors — accuracy is as important as speed.",
},

{
  id: "blind_typing_format_duration",
  type: "event",
  q: [
    "blind typing format",
    "duration blind typing",
    "how long blind typing",
    "rounds blind typing",
    "blind typing rules"
  ],
  a:
    "**Format & duration:** Short timed rounds (typically **5–10 minutes** per attempt). Participants will be given a passage to type with the monitor off — results measured for speed and mistakes.",
},

{
  id: "blind_typing_disqualification",
  type: "event",
  q: [
    "disqualified blind typing",
    "blind typing cheating",
    "rules blind typing",
    "unfair means blind typing"
  ],
  a:
    "**Elimination / disqualification:** Use of unfair means, receiving external help, turning the monitor on, tampering with results, or violating event rules will lead to immediate disqualification.",
},

{
  id: "blind_typing_tips",
  type: "event",
  q: [
    "tips blind typing",
    "how to prepare blind typing",
    "strategy blind typing",
    "practice blind typing",
    "blind typing hacks"
  ],
  a:
    "**Tips:** Practice touch-typing daily, focus on accuracy before speed, familiarise with common punctuation and short words, breathe steadily, and read the full passage once before starting (if allowed). Keep wrists relaxed and use proper posture.",
},

{
  id: "blind_typing_submission",
  type: "event",
  q: [
    "submit blind typing",
    "how to submit blind typing score",
    "blind typing result",
    "blind typing submission"
  ],
  a:
    "Scoring is automatic via the event system (or as per proctor instructions). Ensure you follow the proctor's steps exactly during the attempt. Final results announced after validation — ask volunteers if you have questions.",
},

{
  id: "blind_typing_contact",
  type: "event",
  q: [
    "blind typing contact",
    "who to contact blind typing",
    "help blind typing",
    "organizer blind typing"
  ],
  a:
    "For event-specific queries contact the event coordinator or Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues, share your registration id/email and screenshot with **itronix@gncasc.org**.",
}
,


  // bgmi tournament
  {
    id: "bgmi_tournament",
    type: "event",
    q: ["bgmi", "bgmi tournament", "bgmi event", "bgmi game", "esports bgmi"],
    a:
      "**BGMI Tournament** — Competitive BGMI rounds; scoring by placement & kills.\n\n**Participation:** Team (max 4). **Venue:** Room 309. **Fee:** ₹200 per team.",
  },

  // free fire tournament
  {
  id: "free_fire_overview",
  type: "event",
  q: [
    "free fire", "free-fire", "freefire", "free fire tournament", "free fire event",
    "what is free fire", "free fire overview", "freefire overview"
  ],
  a:
    "**Free Fire** — A high-intensity Battle Royale competition where squads of 4 players compete in custom rooms across multiple rounds. Teams earn points from placements and eliminations; the highest total points across rounds wins.",
},

{
  id: "free_fire_time",
  type: "event",
  q: [
    "free fire time", "what time free fire", "when is free fire", "start time free fire",
    "free fire schedule", "freefire time"
  ],
  a:
    "**Start time:** **9:00 AM** on the fest day (23 January). Teams should arrive **15–30 minutes early** for check-in and room allocation. Check the Events page for last-minute updates.",
},

{
  id: "free_fire_venue",
  type: "event",
  q: [
    "free fire venue", "where free fire", "location free fire", "room for free fire",
    "where is free fire held"
  ],
  a:
    "**Venue:** Classroom **206**. Look for ITRONIX volunteers and signboards at the registration desk for directions on the day.",
},

{
  id: "free_fire_fee",
  type: "event",
  q: [
    "free fire fee", "registration fee free fire", "how much free fire registration",
    "free fire cost", "free fire price", "freefire fee"
  ],
  a:
    "**Registration fee:** ₹180 **per team** (team = up to 4 players). Pay via the Payment page UPI QR and upload the screenshot for verification to confirm your slot.",
},

{
  id: "free_fire_participation",
  type: "event",
  q: [
    "free fire team or individual", "is free fire team event", "participation free fire",
    "team size free fire", "how many players free fire"
  ],
  a:
    "**Participation:** Team event — **Squad of 4 players**. Each team must register under a single team leader/contact email and provide all member names during registration.",
},

{
  id: "free_fire_format",
  type: "event",
  q: [
    "free fire format", "free fire rounds", "how free fire works", "match format free fire",
    "free fire structure"
  ],
  a:
    "**Format:** Multiple rounds (match count & map rotation announced on the day). Each round awards points for placement and kills; final standings are based on total points across rounds. Exact round/map details will be posted before matches begin.",
},

{
  id: "free_fire_scoring",
  type: "event",
  q: [
    "how free fire scored", "free fire scoring", "points free fire", "placement points free fire",
    "kill points free fire"
  ],
  a:
    "**Scoring:** Teams earn **placement points** (for final position) and **kill points** (for eliminations). Final rank is determined by total points across all rounds. Tie-breakers follow judges' rules (placement/earliest finish etc.).",
},

{
  id: "free_fire_rules_disqualification",
  type: "event",
  q: [
    "free fire disqualified", "free fire cheating", "free fire rules", "disqualification free fire",
    "hacks free fire", "mod apk free fire"
  ],
  a:
    "**Elimination / disqualification:** Use of **hacks, mod APKs, scripts, emulators (if disallowed), teaming with outside players, glitches, or any unfair play** will lead to immediate disqualification. Follow proctor instructions and use only official clients as specified by organisers.",
},

{
  id: "free_fire_equipment",
  type: "event",
  q: [
    "free fire devices", "bring phone free fire", "what to bring free fire", "free fire equipment",
    "do i need phone free fire"
  ],
  a:
    "Bring your own device if BYOD is allowed (check announcement). Carry **fully charged device, charger, and college ID**. If organisers provide devices, use only the provided hardware. Confirm device policy on the Events page or with coordinators.",
},

{
  id: "free_fire_registration",
  type: "event",
  q: [
    "how to register free fire", "register free fire", "free fire registration steps",
    "free fire sign up", "how to sign up free fire"
  ],
  a:
    "To register: 1) Click **Register** on the Free Fire event card, 2) Sign in, 3) Provide team member names and leader contact, 4) Pay the ₹180 team fee on the Payment page and upload the payment screenshot for verification. After verification your team slot will be confirmed.",
},

{
  id: "free_fire_tips",
  type: "event",
  q: [
    "free fire tips", "how to prepare free fire", "strategy free fire", "free fire practice",
    "free fire advice"
  ],
  a:
    "Tips: Coordinate drop spots and rotations with your squad, keep communication clear, warm up before matches, carry a power bank, prioritise survival and placement when needed, and keep registration/payment proof (screenshots) ready. Follow proctor instructions carefully.",
},

{
  id: "free_fire_contact",
  type: "event",
  q: [
    "free fire contact", "who to contact free fire", "help free fire", "free fire coordinator"
  ],
  a:
    "For Free Fire queries contact the event coordinator or the Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues email **itronix@gncasc.org** and include your registration id and screenshot.",
},

  // techslides arena
  {
  id: "techslides_overview",
  type: "event",
  q: [
    "techslides",
    "techslides arena",
    "presentation",
    "presentations",
    "slides arena",
    "techslides arena event",
    "what is techslides",
    "techslides overview"
  ],
  a:
    "**TechSlides Arena** — A time-bound presentation competition. The topic is shared in the participants' WhatsApp group **one day before** the event; teams prepare slides within that 24-hour window and present live on the event day. Laptops and standard presentation tools are allowed; keep slides concise and focused.",
},

{
  id: "techslides_time",
  type: "event",
  q: [
    "techslides time",
    "what time techslides",
    "start time techslides",
    "when is techslides",
    "techslides schedule",
    "presentation time"
  ],
  a:
    "**Start time:** **9:30 AM** on the fest day (23 January). Teams must arrive at least **15 minutes early** for setup and slot allocation.",
},

{
  id: "techslides_venue",
  type: "event",
  q: [
    "techslides venue",
    "where techslides",
    "location techslides",
    "room for techslides",
    "where is techslides held",
    "presentation venue"
  ],
  a:
    "**Venue:** 5th floor — **Aura Hall**. Look for signboards and volunteers at the registration desk for directions on the day.",
},

{
  id: "techslides_fee",
  type: "event",
  q: [
    "techslides fee",
    "registration fee techslides",
    "how much techslides registration",
    "techslides cost",
    "presentation fee"
  ],
  a:
    "**Registration fee:** ₹40 **per team**. Pay via the Payment page UPI QR and upload the screenshot for verification to confirm your slot.",
},

{
  id: "techslides_participation",
  type: "event",
  q: [
    "techslides team or individual",
    "is techslides team event",
    "team size techslides",
    "how many members techslides",
    "presentation team size"
  ],
  a:
    "**Participation:** Team event — **maximum 2 members per team**. Each team should register under a single contact email and provide member names during registration.",
},

{
  id: "techslides_judging",
  type: "event",
  q: [
    "how techslides judged",
    "judging criteria techslides",
    "presentation judging",
    "slides judging criteria"
  ],
  a:
    "**Judging criteria:** Slide design & creativity, clarity of content, depth of topic understanding, presentation delivery, and overall impact. Judges' decisions are final.",
},

{
  id: "techslides_disqualification",
  type: "event",
  q: [
    "techslides disqualified",
    "techslides cheating",
    "plagiarism techslides",
    "presentation rules disqualification"
  ],
  a:
    "**Elimination / disqualification:** Use of copied or plagiarized presentations, irrelevant or incorrect content, exceeding time limits, or violating event rules will lead to immediate disqualification.",
},

{
  id: "techslides_format_duration",
  type: "event",
  q: [
    "techslides format",
    "techslides duration",
    "how long techslides",
    "presentation time limit",
    "techslides rounds"
  ],
  a:
    "**Format & duration:** Topic announced 24 hours prior via WhatsApp. On event day teams present live — strict time limits per presentation will be enforced (organizers will announce exact slot duration). Prepare concise slides and rehearse delivery.",
},

{
  id: "techslides_tips",
  type: "event",
  q: [
    "techslides tips",
    "how to prepare techslides",
    "presentation tips",
    "slides tips"
  ],
  a:
    "**Tips:** Focus on a clear structure (Problem → Solution → Demo/Results → Takeaways), use minimal text per slide, include visuals/diagrams, rehearse delivery and timing, test your slides on the actual laptop/platform, and keep backups (PDF + PPT). Cite sources and avoid copy-pasting others' slides.",
},

{
  id: "techslides_submission",
  type: "event",
  q: [
    "submit techslides",
    "how to submit presentation",
    "presentation submission",
    "techslides upload"
  ],
  a:
    "Bring your presentation on a USB drive and/or have it in cloud (Google Drive). Follow on-site instructions for uploading to the presentation machine if required. Arrive early to test compatibility. Final slide deck submission rules (if any) will be announced by coordinators.",
},

{
  id: "techslides_registration",
  type: "event",
  q: [
    "how to register techslides",
    "register techslides",
    "presentation registration steps",
    "techslides sign up"
  ],
  a:
    "To register: 1) Click **Register** on the TechSlides event card, 2) Sign in, 3) Provide team member names and leader contact, 4) Pay the ₹40 team fee via the Payment page and upload the screenshot for verification. After verification your team slot will be confirmed.",
},

{
  id: "techslides_equipment",
  type: "event",
  q: [
    "techslides equipment",
    "what to bring techslides",
    "laptop for techslides",
    "presentation equipment"
  ],
  a:
    "Bring your own laptop and any adaptors (HDMI/USB-C), plus a backup on USB/cloud. Use standard presentation tools (PowerPoint, Google Slides). Test your deck beforehand and keep fonts/images embedded to avoid compatibility issues.",
},

{
  id: "techslides_contact",
  type: "event",
  q: [
    "techslides contact",
    "who to contact techslides",
    "presentation coordinator",
    "help techslides"
  ],
  a:
    "For TechSlides-specific queries contact the event coordinator or Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues email **itronix@gncasc.org** and include your registration id and screenshot.",
}
,

  // treasure hunt
  {
  id: "treasure_hunt_overview",
  type: "event",
  q: [
    "treasure hunt", "treasure-hunt", "hunt", "campus hunt", "treasure", "what is treasure hunt",
    "treasure hunt overview", "treasure hunt event", "how treasure hunt works"
  ],
  a:
    "**Treasure Hunt** — An exciting team adventure where participants follow maps and solve riddles/clues across the campus to reach the final treasure. It tests teamwork, observation and problem solving — no programming needed. Teams must complete tasks and collect proof (photos/answers) at each checkpoint.",
},

{
  id: "treasure_hunt_time",
  type: "event",
  q: [
    "treasure hunt time", "what time treasure hunt", "start time treasure hunt",
    "when is treasure hunt", "treasure hunt schedule"
  ],
  a:
    "**Start time:** **11:30 AM** on the fest day (23 January). Teams should gather at the starting point **15–20 minutes early** for briefing and roll call.",
},

{
  id: "treasure_hunt_venue",
  type: "event",
  q: [
    "treasure hunt venue", "where treasure hunt", "location treasure hunt", "starting point treasure hunt",
    "where is treasure hunt held"
  ],
  a:
    "**Starting point:** Lobby area, Ground Floor. Organisers will give maps and initial clues at the registration desk — look for ITRONIX volunteers on the day.",
},

{
  id: "treasure_hunt_fee",
  type: "event",
  q: [
    "treasure hunt fee", "registration fee treasure hunt", "how much treasure hunt registration",
    "treasure hunt cost", "fee treasure hunt"
  ],
  a:
    "**Registration fee:** ₹120 **per team** (team up to 4 members). Pay using the Payment page and upload the screenshot for verification to confirm your slot.",
},

{
  id: "treasure_hunt_participation",
  type: "event",
  q: [
    "treasure hunt team or individual", "is treasure hunt team event", "team size treasure hunt",
    "how many members treasure hunt", "participation treasure hunt"
  ],
  a:
    "**Participation:** Team event — **maximum 4 members per team**. Choose one team leader for registration and contact details.",
},

{
  id: "treasure_hunt_format_duration",
  type: "event",
  q: [
    "treasure hunt format", "how treasure hunt works", "treasure hunt duration", "how long treasure hunt"
  ],
  a:
    "Format: Teams receive a map and a sequence of clues. Each clue leads to the next checkpoint. The hunt lasts approximately **60–90 minutes** (exact duration announced on the day). The team that completes all checkpoints fastest or scores highest wins.",
},

{
  id: "treasure_hunt_rules_disqualification",
  type: "event",
  q: [
    "treasure hunt rules", "treasure hunt disqualified", "cheating treasure hunt", "rules treasure hunt",
    "disqualification treasure hunt"
  ],
  a:
    "**Rules / Disqualification:** No external help (phones for answers, outside people, or paid guides) allowed for solving clues. Using or hiring outsiders, damaging college property, or breaking event rules will lead to immediate disqualification.",
},

{
  id: "treasure_hunt_safety_conduct",
  type: "event",
  q: [
    "treasure hunt safety", "treasure hunt conduct", "is treasure hunt safe", "what to bring safety treasure hunt"
  ],
  a:
    "**Safety & conduct:** Stay inside permitted areas only and follow volunteers' instructions. Do not enter restricted or private spaces. Keep personal belongings safe and avoid running in crowded spots. If someone gets hurt or lost, notify an organiser immediately.",
},

{
  id: "treasure_hunt_items_to_bring",
  type: "event",
  q: [
    "what to bring treasure hunt", "treasure hunt items", "what to carry for treasure hunt"
  ],
  a:
    "Carry a **charged phone (for photos only)**, water bottle, comfortable shoes, college ID, and a small notebook + pen. Phones should be used only to take proof photos where required — not to search answers online (that’s disallowed).",
},

{
  id: "treasure_hunt_tips",
  type: "event",
  q: [
    "treasure hunt tips", "how to win treasure hunt", "strategy treasure hunt", "treasure hunt advice"
  ],
  a:
    "Tips: Assign roles (navigator, clue reader, photographer), split tasks quickly, read clues carefully before rushing, stay calm, and keep communication clear. Take quick photos as proof instead of long videos. Work smart — sometimes the simplest idea is the right one.",
},

{
  id: "treasure_hunt_registration",
  type: "event",
  q: [
    "how to register treasure hunt", "register treasure hunt", "treasure hunt sign up",
    "treasure hunt registration steps"
  ],
  a:
    "To register: 1) Click **Register** on the Treasure Hunt event card, 2) Sign in, 3) Provide team member names and leader contact, 4) Pay ₹120 team fee on the Payment page and upload the screenshot for verification. After verification your team slot will be confirmed.",
},

{
  id: "treasure_hunt_contact",
  type: "event",
  q: [
    "treasure hunt contact", "who to contact treasure hunt", "help treasure hunt", "treasure hunt coordinator"
  ],
  a:
    "For Treasure Hunt queries contact the event coordinator or the Technical Head **Imran Ali (+91 9905956912)**. For registration/payment issues email **itronix@gncasc.org** and include your registration id and screenshot.",
},


  // Contact info
  {
    id: "fest_contact",
    type: "contact",
    q: ["organizer", "contact", "technical head", "who to contact", "fest contact", "itronix contact", "phone", "contact number", "telephone", "email"],
    a:
      "For help contact the Technical Head **Imran Ali** at **+91 9905956912** or email **itronix@gncasc.org**. For registration/payment issues, mention the event name and your registered email/phone for faster help.",
  },

  // College info
  {
    id: "college_name",
    type: "info",
    q: ["college", "which college", "what college", "college name", "gnc", "which college is this"],
    a:
      "This fest is organized by **Guru Nanak College of Arts, Science & Commerce (G.T.B. Nagar), Mumbai**.",
  },
  {
    id: "college_address",
    type: "info",
    q: ["address", "location", "where is the college", "gtb", "gtb nagar", "sion", "college location"],
    a:
      "Guru Nanak College (G.T.B. Nagar) address: **Guru Tegh Bahadur Nagar (G.T.B. Nagar), Mumbai - 400037**. Search 'Guru Nanak College GTB Nagar Mumbai' on maps for directions.",
  },
  {
    id: "college_website",
    type: "info",
    q: ["website", "site", "official site", "college website", "gncasc"],
    a:
      "Official college sites: **https://www.gurunanakcollegeasc.in/** and **https://gncasc.org/** — check them for official notices.",
  },

  // Registration status & dashboard
  {
    id: "registration_status",
    type: "how-to",
    q: ["my registration", "registration status", "check registration", "where is my registration", "registration status check"],
    a:
      "contact the technical head with your registered email/phone number to check your registration status.phone -> +91 9905956912",
  },

  // Payment verification time
  {
    id: "payment_verification_time",
    type: "faq",
    q: ["verify time", "verification time", "how long to verify", "how long verification takes", "payment confirmation time"],
    a:
      "Verification usually takes **a few hours** to up to **24 hours** depending on volume. If verification takes longer, contact the tech team with your registered email/phone.",
  },

  // Refunds & cancellations
  {
    id: "refunds",
    type: "policy",
    q: ["refund", "cancellation", "cancel registration", "refund policy"],
    a:
      "Refunds/cancellations are handled case-by-case. For paid events, refunds are not guaranteed unless the event is cancelled by the organizers. Contact the fest technical head with registration details to discuss.",
  },

  // Certificates & results
  {
    id: "certificates",
    type: "faq",
    q: ["certificate", "certificate download", "results", "winners", "prize", "certificate issue"],
    a:
      "Winners will receive certificates, trophies and cash prizes as announced. Certificates will be distributed after the event or available for download from the Dashboard/Results page (if published). Keep your registration ID handy.",
  },

  // Volunteer & sponsorship
  {
    id: "volunteer",
    type: "info",
    q: ["volunteer", "volunteers", "how to volunteer", "join team", "help in fest"],
    a:
      "To volunteer, contact the fest coordinator through the contact number or email. Volunteers get certificates and may help with event logistics, scoring, and coordination.",
  },
  {
    id: "sponsorship",
    type: "info",
    q: ["sponsor", "sponsorship", "sponsor us", "sponsors", "how to sponsor"],
    a:
      "For sponsorship inquiries, reach out via **itronix@gncasc.org** and include your company details and sponsorship proposal. The organizing team will follow up.",
  },

  // Technical help (sign-in, clerk, debug)
  {
    id: "signin_help",
    type: "how-to",
    q: ["sign in", "signin", "login", "clerk", "can't sign in", "login issue", "signup problem"],
    a:
      "Sign-in uses Clerk. If you can't sign in, try clearing browser cache, use the same email you registered with, or use the **Sign in** link on the site. If Clerk shows an error after sign-in attempt, note the redirect URL and contact the technical head with the error details.",
  },

  // How to upload correct screenshot (step-by-step)
  {
    id: "how_to_upload",
    type: "how-to",
    q: ["how to upload", "upload screenshot", "screenshot upload", "upload steps"],
    a:
      "Upload steps: 1) Pay using the provided UPI QR. 2) Take a clear screenshot showing UPI app name, transaction amount, timestamp and UPI reference. 3) On Payment page click 'Choose File' -> select screenshot -> click 'Upload Screenshot & Save'. 4) Wait for verification. If you get an error, contact the tech team and keep the screenshot file ready.",
  },

  // Troubleshooting: images not showing, file errors
  {
    id: "upload_errors",
    type: "troubleshoot",
    q: ["file error", "upload failed", "file too large", "image not showing", "preview not showing", "file not uploading"],
    a:
      "If upload fails: ensure the file is an image (jpg/png/webp), under 10MB, and you are signed in. If preview doesn't show, try a different browser or clear cache. For server errors, copy the console error and contact the tech team.",
  },

  // What to bring / rules for participants
  {
    id: "what_to_bring",
    type: "faq",
    q: ["what to bring", "bring", "requirements", "materials", "things to carry", "laptop needed"],
    a:
      "Bring a valid college ID, charged laptop (if the event needs it), pen, and your registration confirmation. Event pages mention if a laptop is required. For coding events, bring a charger and your environment set up (offline editors allowed).",
  },

  // Venue / map / directions and parking
  {
    id: "venue_parking",
    type: "info",
    q: ["venue", "where", "room", "309", "206", "3rd floor", "auditorium", "parking", "map", "where to go"],
    a:
      "Most events are inside Guru Nanak College campus. Competitive computer events: 2nd & 3rd floor computer labs. BGMI: Room 309. Free Fire: Room 206. Treasure Hunt starts at ground floor lobby. For exact room locations, check the Events page or ask at the Query desk on the day.",
  },

  // Social / media / share
  {
    id: "social",
    type: "info",
    q: ["social", "instagram", "facebook", "twitter", "share", "follow", "youtube"],
    a:
      "Follow the college/fest social pages (check the website footer) for live updates, photos and winners. If you want us to add links publicly, message the organizing team.",
  },

  // Fallback
  {
    id: "default",
    type: "fallback",
    q: [],
    a:
      "I answer ITRONIX fest & Guru Nanak College related questions (dates, registration, events, payments, workshops, rules, contact). Try: **'When is the fest?'**, **'How to register?'**, **'Web Development event details'**, or **'How to upload payment screenshot?'**.",
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
    if (item.q.some((q) => text.startsWith(normalizeText(q)))) score += 1

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

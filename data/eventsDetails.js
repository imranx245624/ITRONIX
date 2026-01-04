// data/eventsDetails.js
// export an object keyed by slugified event title
export const eventDetails = {
  "web-development": {
    title: "Web Development",
    overview:
      "Build a small full-stack website or feature in a limited time. Focus on UI, functionality and deployment/demo.",
    rules: [
      "Time limit: 3 hours.",
      "Team size: 2-3 members.",
      "Use any tech stack (mention stack during demo).",
      "Plagiarism will disqualify the team."
    ],
    format: "Hack-style: build + 5-min demo + Q&A",
    judging: [
      "Functionality (40%)",
      "UI/UX (25%)",
      "Originality (20%)",
      "Presentation (15%)"
    ],
    prize: "₹7,000 + certificates",
    team_size: "2-3",
    date: "TBD",
    venue: "Lab 204 / Online demo allowed",
    contact: { name: "Web Lead", phone: "99999XXXXX", email: "web@itronix.org" },
    register_url: "https://your-register-link.example.com"
  },

  "hackathon": {
    title: "Hackathon",
    overview:
      "48-hour challenge to build an innovative solution to given themes. Focus on idea, MVP and pitch.",
    rules: [
      "Time limit: 48 hours.",
      "Team size: up to 4.",
      "Use third-party services allowed but be transparent.",
      "Submit repository and a 3-slide pitch."
    ],
    format: "Prototype + 5-min pitch to judges",
    judging: ["Impact (35%)", "Tech (30%)", "Design (20%)", "Pitch (15%)"],
    prize: "₹15,000 + internships",
    team_size: "1-4",
    date: "TBD",
    venue: "Auditorium / Online",
    contact: { name: "Hack Lead", phone: "99999XXXXX", email: "hack@itronix.org" },
    register_url: "https://your-register-link.example.com"
  },

  "blind-typing": {
    title: "Blind Typing",
    overview:
      "Test typing speed and accuracy without seeing the text (on-screen obfuscated).",
    rules: ["Solo event", "Time limit: 10 minutes", "Results judged by speed & accuracy"],
    format: "Automatic scoring; top 3 winners",
    judging: ["WPM & Accuracy combined"],
    prize: "₹2,000",
    team_size: "1",
    date: "TBD",
    venue: "Lab 101",
    contact: { name: "Typing Lead", phone: "99999XXXXX" },
    register_url: "https://your-register-link.example.com"
  },

  "vibe-coding": {
    title: "Vibe Coding",
    overview:
      "Live coding contest with multiple short problems. Time-limited rounds — speed is key.",
    rules: ["Solo", "Standard input/output", "No external help"],
    format: "Multiple rounds; elimination style",
    judging: ["Problems solved", "Time penalty"],
    prize: "₹3,000",
    team_size: "1",
    date: "TBD",
    venue: "Computer Lab",
    contact: { name: "Algo Lead", email: "algo@itronix.org" },
    register_url: "https://your-register-link.example.com"
  },

  "code-golf": {
    title: "Code Golf",
    overview: "Write the shortest code possible that solves given problems.",
    rules: [
      "Solo",
      "Languages allowed: JS/Python/Java",
      "Shortest source length wins (bytes/characters)"
    ],
    format: "Points per challenge; lowest total length wins",
    judging: ["Correctness then length"],
    prize: "₹2,000",
    team_size: "1",
    date: "TBD",
    venue: "Lab 102",
    contact: { name: "Code Golf Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "bug-busters": {
    title: "Bug-Busters",
    overview:
      "Teams are given buggy codebases; identify and fix as many bugs as possible.",
    rules: ["Team size: 2-3", "Points for each fix verified by judge"],
    format: "Timed bugs -> validated fixes",
    judging: ["Bugs fixed", "Quality of fix"],
    prize: "₹4,000",
    team_size: "2-3",
    date: "TBD",
    venue: "Lab 103",
    contact: { name: "QA Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "treasure-hunt": {
    title: "Treasure Hunt",
    overview:
      "Live campus/online puzzle hunt — solve clues to reach next location. Teamwork + thinking.",
    rules: ["Team size: 3-5", "Follow event marshals' instructions"],
    format: "Sequential clue solving; first to finish wins",
    judging: ["Time to finish", "Penalties for rule violations"],
    prize: "₹3,000",
    team_size: "3-5",
    date: "TBD",
    venue: "Campus",
    contact: { name: "TH Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "byte-sized-battles": {
    title: "Byte Sized Battles",
    overview: "Short algorithmic duels — 1v1 bracket style. Fast coding, quick wins.",
    rules: ["Solo 1v1", "Single elimination", "Time per round limited"],
    format: "Bracket with best-of-3 matches",
    judging: ["Win rounds", "Speed"],
    prize: "₹5,000",
    team_size: "1",
    date: "TBD",
    venue: "Lab 104",
    contact: { name: "Comp Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "presentation": {
    title: "Presentation",
    overview:
      "Short tech/business presentations by participants. Topic pre-approved or given on spot.",
    rules: ["Team/solo allowed", "Time: 7 minutes + 3 minutes Q&A"],
    format: "Presentation + jury Q&A",
    judging: ["Content (50%)", "Delivery (30%)", "Relevance (20%)"],
    prize: "₹2,500",
    team_size: "1-3",
    date: "TBD",
    venue: "Seminar Hall",
    contact: { name: "Presentation Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "bgmi": {
    title: "BGMI",
    overview: "Battle Royale mobile e-sports tournament. Play fair, no cheating.",
    rules: ["Teams of 4", "Standard BGMI rules apply"],
    format: "Multiple matches; total points decide winners",
    judging: ["In-game points", "Fair play"],
    prize: "₹6,000",
    team_size: "4",
    date: "TBD",
    venue: "Gaming Zone",
    contact: { name: "Esports Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "free-fire": {
    title: "Free Fire",
    overview: "Free Fire tournament, similar rules to BGMI event.",
    rules: ["Teams of 4", "Follow organizers' room rules"],
    format: "Multiple matches; cumulative points",
    judging: ["In-game points"],
    prize: "₹6,000",
    team_size: "4",
    date: "TBD",
    venue: "Gaming Zone",
    contact: { name: "Esports Lead" },
    register_url: "https://your-register-link.example.com"
  },

  "ludo": {
    title: "Ludo",
    overview: "Classic Ludo tournament for quick fun and prizes.",
    rules: ["Solo / 2-player format depending on bracket", "Fair play required"],
    format: "Knockout bracket",
    judging: ["Match wins"],
    prize: "₹1,500",
    team_size: "1-2",
    date: "TBD",
    venue: "Common Area",
    contact: { name: "Events Lead" },
    register_url: "https://your-register-link.example.com"
  }
};

export default eventDetails;

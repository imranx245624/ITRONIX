// data/eventsDetails.js
// Event details taken exactly from the provided document.
// Only per-event information present in the document is included.
// Do NOT add extra fields beyond what the document provides.

export const eventDetails = {


  "ui-verse": {
    title: "UI-Verse",
    overview:
      "A creative design competition where participants design a visually appealing and user-friendly website interface based on an on-the-spot topic within a limited time.",
    judging: [
      "Creativity",
      "Visual appeal",
      "Layout clarity",
      "Practicality of the UI design"
    ],
    elimination_condition: "Any copied design, irrelevant or incorrect content, or violation of rules (including use of internet or AI tools) will lead to immediate disqualification.",
    participation_type: "Individual",
    venue: "2nd floor computer lab ",
    registration_fee: "₹30 per participant"
  },

  "bug-busters": {
    title: "Bug Busters",
    overview:
    "A hands-on debugging competition where participants identify and fix errors in given programs using logical thinking and programming skills within a limited time. Languages that are used to solve problems - python, c, c++ , java (choose your preferred language)",
      // "A hands-on debugging competition where participants identify and fix errors in given programs using logical thinking and programming skills within a limited time.languages that is used to solve problems - python, c, c++ , java etc.",
    judging: [
      "Number of bugs correctly fixed",
      "Solution accuracy",
      "Code efficiency",
      "Readability",
      "Time taken"
    ],
    elimination_condition:
      "Any form of plagiarism, malpractice, or violation of rules (including use of internet or AI tools) will lead to immediate disqualification.",
    participation_type: "Individual",
    venue: "3rd floor computer lab at 11 AM",
    registration_fee: "₹35 per participant"
  },

  "code-golf": {
    title: "Code Golf",
    overview:
      "A competitive coding event where participants solve a given problem using the minimum number of characters, focusing on logic, creativity, and efficient coding skills within a limited time.",
    judging: [
      "Correctness of output",
      "Shortest code length (characters)",
      "Efficient use of language features",
      "Earliest valid submission in case of a tie"
    ],
    elimination_condition:
      "Any incorrect output, use of comments, plagiarism, external help, internet access, or rule violation will lead to disqualification.",
    participation_type: "Individual",
    venue: "2nd floor computer lab at 12 PM",
    registration_fee: "₹30 per participant"
  },

  "vibe-coding": {
    title: "Vibe Coding",
    overview:
    "Vibe Coding is a fast-paced, innovative competition where participants use multiple AI tools (e.g., ChatGPT, v0.app, Cursor, Gemini/Cloud AI) to rapidly design and build practical, web-based solutions on a shared theme. The focus is on prompt engineering and tool orchestration with minimal manual coding—teams must deliver a functional prototype within the time limit. Judging rewards creativity, usability, and how effectively AI was leveraged to solve the challenge.",
      // "An innovative competition where participants use AI tools to design creative, practical web-based solutions on a common topic within a limited time.",
    judging: [
      "Problem understanding",
      "Effective use of AI tools",
      "Creativity",
      "Originality",
      "Practical usefulness",
      "Clarity of explanation"
    ],
    elimination_condition:
      "Any form of plagiarism, idea duplication, unfair means, or violation of rules will result in immediate disqualification.",
    participation_type: "Individual",
    venue: "2nd floor computer lab at 9 AM",
    registration_fee: "₹100 per participant"
  },

  "blind-typing": {
    title: "Blind Typing",
    overview:
      "A skill-based competition where participants type a given paragraph with the monitor switched off, testing their typing speed, accuracy, and muscle memory within a fixed time.",
    judging: ["Typing speed (WPM)", "Accuracy"],
    elimination_condition: "Using unfair means or violating event rules will lead to immediate disqualification.",
    participation_type: "Individual",
    venue: "3rd floor computer lab at 10 AM",
    registration_fee: "₹20 per participant"
  },

  

  "techslides-arena": {
    title: "TechSlides Arena",
    overview:
      "A time-bound presentation competition where the topic will be shared in the participants’ WhatsApp group one day before the event; teams prepare slides in that 24-hour window and present their solution live on the event day. Laptops and standard presentation tools are allowed; keep slides concise and focused. Time limits per presentation will be enforced and judges’ decisions are final.",
    judging: [
      "Slide design and creativity",
      "Clarity of content",
      "Depth of topic understanding",
      "Presentation delivery",
      "Overall impact"
    ],
    elimination_condition:
      "Use of copied or plagiarized presentations, incorrect or irrelevant content, exceeding time limits, or violation of event rules will result in immediate disqualification.",
    participation_type: "Team (Maximum 2 members per team)",
    venue: "5th floor Aura Hall at 9:30 AM",
    registration_fee: "₹40 per team"
  },

  "treasure-hunt": {
    title: "Treasure Hunt",
    overview:
      "An exciting team-based adventure where participants follow a map and solve riddles to uncover clues and reach the final treasure.",
    judging: [
      "Overall points scored after completing the hunt",
      "First to finish wins in case of a tie"
    ],
    elimination_condition:
      "Teams that fail to complete the hunt or use any form of external assistance will be immediately disqualified.",
    participation_type: "Team (Maximum 4 members per team)",
    venue: "Starting point lobby area ground floor at 11:30 AM",
    registration_fee: "₹120 per team"
  },


  "bgmi-tournament": {
    title: "BGMI Tournament",
    overview:
      "A competitive BGMI esports tournament where teams battle strategically across rounds to earn maximum points through survival and eliminations.",
    judging: ["Placement points", "Kill points", "Overall match performance"],
    elimination_condition:
      "Round 1 teams not in the Top 8 will be eliminated and further eliminations will be based on total points scored.",
    participation_type: "Team (Maximum 4 members per team)",
    venue: "Classroom 309 at 9 AM",
    registration_fee: "₹200 per team"
  },

  "free-fire": {
    title: "Free Fire",
    overview:
      "A high-intensity Battle Royale gaming competition where squad teams compete in custom rooms to earn points through survival and eliminations across multiple maps.",
    judging: ["Total points earned from match placements and kills across all rounds"],
    elimination_condition:
      "Use of hacks, mod APKs, scripts, emulators, teaming, glitches, or any form of unfair play will result in immediate disqualification.",
    participation_type: "Team (Squad of 4 players)",
    venue: "Classroom 206 at 9 AM",
    registration_fee: "₹180 per team"
  }

}

export default eventDetails

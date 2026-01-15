// data/eventsDetails.js
// Event details taken exactly from the provided document.
// Only per-event information present in the document is included.
// Do NOT add extra fields beyond what the document provides.

export const eventDetails = {
  "web-development": {
    title: "Web Development",
    overview:
      "A live web development competition where participants design and build a responsive landing page using HTML, CSS, and JavaScript within a limited time on an on-the-spot given topic.",
    judging: [
      "Design and appearance",
      "Clarity of content",
      "Creativity",
      "Responsiveness",
      "Proper use of HTML, CSS, and JavaScript"
    ],
    elimination_condition: "Use of AI tools or AI-generated code will lead to direct disqualification.",
    participation_type: "Individual",
    venue: "2nd floor computer lab",
    registration_fee: "₹50 per participant"
  },

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
    venue: "2nd floor computer lab",
    registration_fee: "₹30 per participant"
  },

  "bug-busters": {
    title: "Bug Busters",
    overview:
      "A hands-on debugging competition where participants identify and fix errors in given programs using logical thinking and programming skills within a limited time.",
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
    venue: "2nd floor computer lab",
    registration_fee: "₹50 per participant"
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
    venue: "2nd floor computer lab",
    registration_fee: "₹50 per participant"
  },

  "vibe-coding": {
    title: "Vibe Coding",
    overview:
      "An innovative competition where participants use AI tools to design creative, practical web-based solutions on a common topic within a limited time.",
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
    venue: "3rd floor computer lab",
    registration_fee: "₹50 per participant"
  },

  "blind-typing": {
    title: "Blind Typing",
    overview:
      "A skill-based competition where participants type a given paragraph with the monitor switched off, testing their typing speed, accuracy, and muscle memory within a fixed time.",
    judging: ["Typing speed (WPM)", "Accuracy"],
    elimination_condition: "Using unfair means or violating event rules will lead to immediate disqualification.",
    participation_type: "Individual",
    venue: "3rd floor computer lab",
    registration_fee: "₹50 per participant"
  },

  

  "techslides-arena": {
    title: "TechSlides Arena",
    overview:
      "A time-bound presentation competition where participants create and present a presentation on a given on-the-spot topic, showcasing their technical knowledge, creativity, and presentation skills.",
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
    venue: "3rd floor computer lab",
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
    venue: "Starting point: 3rd floor",
    registration_fee: "₹50 per team"
  },

  "byte-sized-battles": {
    title: "Byte Sized Battles",
    overview:
      "A fast-paced fun-tech challenge where participants complete real-time electronics-based tasks involving circuit building, logical implementation, and practical problem-solving under time pressure.",
    judging: [
      "Task completion accuracy",
      "Correctness of ES circuit connections",
      "Logical implementation",
      "Practical understanding of components",
      "Time taken"
    ],
    elimination_condition:
      "Failure to complete ES-based tasks within the given time, incorrect circuit execution, or violation of event rules will result in elimination.",
    participation_type: "Individual",
    venue: "3rd floor laboratory",
    registration_fee: "₹50 per participant"
  },
  "bgmi-tournament": {
    title: "BGMI Tournament",
    overview:
      "A competitive BGMI esports tournament where teams battle strategically across rounds to earn maximum points through survival and eliminations.",
    judging: ["Placement points", "Kill points", "Overall match performance"],
    elimination_condition:
      "Round 1 teams not in the Top 8 will be eliminated and further eliminations will be based on total points scored.",
    participation_type: "Team (Maximum 4 members per team)",
    venue: "Classroom 309",
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
    venue: "Room 206",
    registration_fee: "₹100 per team"
  }

}

export default eventDetails

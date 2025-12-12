export function normalizeCategory(value) {
  if (!value && value !== "") return ""
  const v = String(value).trim().toLowerCase()

  // canonical ids used in UI
  if (["hackathon", "tech", "technical", "tech events", "tech-events"].includes(v)) return "hackathon"
  if (["innovation-fair", "innovationfair", "innovation", "creative", "creative events", "nonit"].includes(v))
    return "innovation-fair"
  if (["cyber-arena", "cyberarena", "cyber", "cyber arena"].includes(v)) return "cyber-arena"

  // fallback: return cleaned token (preserve known exact ids)
  return v
}

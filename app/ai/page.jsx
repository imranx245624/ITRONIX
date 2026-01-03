"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import * as festBrainModule from "@/components/ai/festBrain"

/* ---------- Brain hookup ---------- */
const getBestReply =
  festBrainModule && (festBrainModule.getBestReply || festBrainModule.default)
    ? (msg) => {
        try {
          return (festBrainModule.getBestReply || festBrainModule.default)(msg)
        } catch (err) {
          console.error("festBrain error:", err)
          return "Sorry — internal error. Please contact admin."
        }
      }
    : () => "AI brain not available right now. Please check festBrain module."

/* ---------- Page ---------- */
export default function AiPage() {
  const router = useRouter()
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("itronix_ai_chat_v1")
      return raw && JSON.parse(raw).length
        ? JSON.parse(raw)
        : [
            {
              id: "bot-1",
              who: "bot",
              text:
                "Hi! I'm ITRONIX Assistant — ask about fest dates, registration, events, payments, workshops, or contact.",
            },
          ]
    } catch {
      return [
        {
          id: "bot-1",
          who: "bot",
          text:
            "Hi! I'm ITRONIX Assistant — ask about fest dates, registration, events, payments, workshops, or contact.",
        },
      ]
    }
  })

  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem("itronix_ai_chat_v1", JSON.stringify(messages))
    } catch {}
    // safe scroll to bottom of message container
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async (text) => {
    const trimmed = text?.toString()?.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { id: Date.now(), who: "user", text: trimmed }])
    setInput("")
    setTyping(true)

    await new Promise((r) => setTimeout(r, 450 + Math.random() * 500))
    const reply = getBestReply(trimmed)
    setTyping(false)
    setMessages((m) => [...m, { id: Date.now() + 1, who: "bot", text: reply }])
  }

  const onSubmit = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
  }

  const quickAsk = (q) => sendMessage(q)

  const clearChat = () => {
    const starter = {
      id: "bot-1",
      who: "bot",
      text:
        "Hi! I'm ITRONIX Assistant — ask about fest dates, registration, events, payments, workshops, or contact.",
    }
    setMessages([starter])
    try {
      localStorage.removeItem("itronix_ai_chat_v1")
    } catch {}
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  /* Inline background (ChatGPT-like) and inline border for chat card (cyber-orange) */
  const pageBgInline = {
    backgroundColor: "#041014",
    backgroundImage:
      "radial-gradient(600px 300px at 8% 8%, rgba(0,200,255,0.03), transparent 6%)," +
      "radial-gradient(500px 240px at 92% 92%, rgba(255,106,0,0.02), transparent 6%)," +
      "linear-gradient(180deg, rgba(7,12,15,0.98), rgba(4,7,10,0.98))",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100dvh",
  }

  const cardInline = {
    border: "2px solid rgba(255,106,0,0.85)", // cyber-orange inline
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  }

  return (
    <div style={pageBgInline} className="text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-5">
        {/* Top bar: Back button + title + Clear (no Home) */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#071214]/70 border border-neon-cyan/8 hover:bg-[#071214]/90 transition"
            >
              <svg className="w-4 h-4 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-rajdhani font-bold text-neon-cyan">
                ITRONIX AI Assistant
              </h1>
              <p className="text-xs text-muted-text hidden sm:block">Fest-related queries only</p>
            </div>
          </div>

          <div>
            <button
              onClick={clearChat}
              style={{ border: "1px solid rgba(255,106,0,0.35)" }}
              className="text-xs px-3 py-2 rounded-md text-neon-cyan bg-transparent hover:bg-neon-cyan/6 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Chat card */}
        <div className="relative rounded-2xl overflow-hidden bg-[#071014]/60" style={cardInline}>
          {/* Messages area */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="overflow-y-auto p-6"
            style={{
              // desktop: 56vh, mobile overridden via CSS below so page doesn't need body scroll
              height: "56vh",
              background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.5))",
            }}
          >
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.who === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="rounded-lg px-5 py-3 text-sm max-w-[80%] break-words shadow-sm"
                    style={
                      m.who === "user"
                        ? { background: "linear-gradient(90deg,#00fff0,#00d6c2)", color: "#001" }
                        : { background: "#000", color: "#cfeef0", borderRadius: 12 }
                    }
                  >
                    <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }} />
                  </div>
                </div>
              ))}

              {typing && <div className="text-sm text-neon-cyan animate-pulse">AI is typing...</div>}
            </div>
          </div>

          {/* Right-side quick vertical buttons (desktop only) */}
          {/* <div className="absolute right-4 top-20 hidden md:flex flex-col gap-3 z-20">
            {["Workshops", "Contact", "Payment screenshot", "How to register?"].map((q) => (
              <button
                key={q}
                onClick={() => quickAsk(q)}
                className="px-4 py-2 rounded-md bg-neon-cyan text-black font-medium shadow"
                style={{ minWidth: 160 }}
              >
                {q}
              </button>
            ))}
          </div> */}

          {/* Quick action row + input */}
          <div className="border-t border-neon-cyan/10 bg-[#071014]/50 p-4">
            <div className="flex flex-wrap gap-3 mb-3">
              {["When is the fest?", "How to register?", "Payment screenshot", "Workshops", "Contact"].map((q) => (
                <button
                  key={q}
                  onClick={() => quickAsk(q)}
                  className="text-xs px-3 py-2 rounded-md border border-neon-cyan/12 text-neon-cyan hover:bg-neon-cyan/8 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex gap-3 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about ITRONIX fest…"
                className="flex-1 bg-transparent text-sm px-4 py-3 rounded-md border border-neon-cyan/10 outline-none focus:border-neon-cyan"
                aria-label="Ask ITRONIX AI"
              />
              <button type="submit" className="px-4 py-3 bg-neon-cyan text-black rounded-md font-semibold">
                Send
              </button>
            </form>
          </div>
        </div>

        {/* footer note */}
        <p className="mt-6 text-center text-xs text-muted-text">This AI answers only ITRONIX fest related questions.</p>
      </div>

      {/* Mobile-only size tweak: avoid body/page scroll while keeping the inner message container scrollable */}
      <style jsx>{`
        @media (max-width: 640px) {
          /* message area uses calc so header + quick buttons + input fit within viewport */
          div[role="log"] {
            height: calc(100vh - 220px) !important;
          }
        }

        /* scrollbar styling for messages area (unchanged behaviour) */
        div[role="log"]::-webkit-scrollbar {
          width: 10px;
        }
        div[role="log"]::-webkit-scrollbar-thumb {
          background: rgba(0, 200, 255, 0.08);
          border-radius: 999px;
        }
      `}</style>
    </div>
  )
}

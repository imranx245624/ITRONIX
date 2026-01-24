// // components/ai/AIChatModal.jsx
// "use client"

// import { AI_THEME } from "./AITheme"

// export default function AIChatModal({ onClose }) {
//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center px-3"
//       style={{
//         background: "rgba(2,6,11,0.65)",
//         backdropFilter: "blur(8px)",
//         WebkitBackdropFilter: "blur(8px)",
//       }}
//       onClick={onClose}
//     >
//       {/* Modal box */}
//       <div
//         className="relative w-full max-w-3xl h-[88vh] rounded-2xl overflow-hidden shadow-2xl"
//         style={{
//           background: AI_THEME.bgDark,
//           border: `1px solid ${AI_THEME.borderSoft}`,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           className="flex items-center justify-between px-4 py-3"
//           style={{
//             background: "linear-gradient(90deg, #030411, #06101a)",
//             borderBottom: `1px solid ${AI_THEME.borderSoft}`,
//           }}
//         >
//           <h2
//             className="font-bold tracking-wide"
//             style={{ color: AI_THEME.neonCyan }}
//           >
//             ITRONIX AI Assistant
//           </h2>

//           <button
//             onClick={onClose}
//             className="px-3 py-1 rounded-md text-sm font-semibold"
//             style={{
//               color: AI_THEME.neonMagenta,
//               border: `1px solid ${AI_THEME.neonMagenta}33`,
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* AI Page */}
//         <iframe
//           src="/ai"
//           title="ITRONIX AI"
//           className="w-full h-full border-none"
//         />
//       </div>
//     </div>
//   )
// }

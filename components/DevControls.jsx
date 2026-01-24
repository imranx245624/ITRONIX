// "use client"

// import { useEffect, useState } from "react"

// /**
//  * DevControls
//  * - Small dev-only panel to tweak bloom / speed / composer / pause / resume
//  * - Looks for window.__TECH_SCENE (set by CanvasBackground)
//  * - Place this component inside a dev-only area (layout or Hero) while developing.
//  *
//  * Usage: <DevControls />
//  */
// export default function DevControls() {
//   const [sceneReady, setSceneReady] = useState(false)
//   const [sceneObj, setSceneObj] = useState(null)
//   const [bloomS, setBloomS] = useState(0.9)
//   const [bloomR, setBloomR] = useState(0.6)
//   const [bloomT, setBloomT] = useState(0.05)
//   const [speed, setSpeed] = useState(0.0009)
//   const [composerOn, setComposerOn] = useState(true)
//   const [running, setRunning] = useState(true)

//   // poll for the scene object (short-lived)
//   useEffect(() => {
//     let cancelled = false
//     let tries = 0
//     const poll = () => {
//       const sc = window.__TECH_SCENE
//       if (sc) {
//         if (!cancelled) {
//           setSceneObj(sc)
//           setSceneReady(true)
//           // pull current state if available
//           if (typeof sc.log === "function") sc.log()
//         }
//         return
//       }
//       tries++
//       if (tries < 40 && !cancelled) {
//         setTimeout(poll, 200)
//       } else {
//         if (!cancelled) setSceneReady(false)
//       }
//     }
//     poll()
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   useEffect(() => {
//     if (!sceneObj) return
//     // try to initialize UI state from scene functions if present
//     // best-effort only
//     if (typeof sceneObj.setBloom === "function") {
//       sceneObj.setBloom(bloomS, bloomR, bloomT)
//     }
//     if (typeof sceneObj.setSpeed === "function") {
//       sceneObj.setSpeed(speed)
//     }
//   }, [sceneObj])

//   const applyBloom = () => {
//     if (!sceneObj || typeof sceneObj.setBloom !== "function") return
//     sceneObj.setBloom(Number(bloomS), Number(bloomR), Number(bloomT))
//   }

//   const applySpeed = () => {
//     if (!sceneObj || typeof sceneObj.setSpeed !== "function") return
//     sceneObj.setSpeed(Number(speed))
//   }

//   const toggleComposer = () => {
//     if (!sceneObj || typeof sceneObj.toggleComposer !== "function") return
//     sceneObj.toggleComposer()
//     setComposerOn((s) => !s)
//   }

//   const handlePause = () => {
//     if (!sceneObj) return
//     if (typeof sceneObj.stop === "function") sceneObj.stop()
//     setRunning(false)
//   }

//   const handleResume = () => {
//     if (!sceneObj) return
//     if (typeof sceneObj.start === "function") sceneObj.start()
//     setRunning(true)
//   }

//   const handleLog = () => {
//     if (!sceneObj) return
//     if (typeof sceneObj.log === "function") sceneObj.log()
//     else console.log("sceneObj", sceneObj)
//   }

//   // hide on production automatically
//   if (process.env.NODE_ENV !== "development") return null

//   return (
//     <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 9999 }}>
//       <div style={{
//         width: 320,
//         maxWidth: "calc(100vw - 24px)",
//         background: "rgba(6,8,12,0.75)",
//         border: "1px solid rgba(78, 255, 255, 0.08)",
//         color: "#cfeefc",
//         padding: 12,
//         borderRadius: 12,
//         fontFamily: "Inter, system-ui, sans-serif",
//         boxShadow: "0 6px 30px rgba(0,0,0,0.5)",
//         backdropFilter: "blur(6px)",
//       }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//           <strong style={{ fontSize: 13 }}>Dev Controls (TECH SCENE)</strong>
//           <button onClick={() => { if (typeof window !== "undefined") { window.__TECH_SCENE && window.__TECH_SCENE.log && window.__TECH_SCENE.log() } }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#cfeefc", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>Inspect</button>
//         </div>

//         <div style={{ fontSize: 12, color: "#8fbfca", marginBottom: 8 }}>
//           {sceneReady ? "Scene connected" : "Waiting for scene..."}
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Bloom strength: {bloomS}</label>
//           <input type="range" min="0" max="2.5" step="0.05" value={bloomS} onChange={(e) => setBloomS(e.target.value)} onMouseUp={applyBloom} onTouchEnd={applyBloom} style={{ width: "100%" }} />
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Bloom radius: {bloomR}</label>
//           <input type="range" min="0" max="2" step="0.05" value={bloomR} onChange={(e) => setBloomR(e.target.value)} onMouseUp={applyBloom} onTouchEnd={applyBloom} style={{ width: "100%" }} />
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Bloom threshold: {bloomT}</label>
//           <input type="range" min="0" max="1" step="0.01" value={bloomT} onChange={(e) => setBloomT(e.target.value)} onMouseUp={applyBloom} onTouchEnd={applyBloom} style={{ width: "100%" }} />
//         </div>

//         <div style={{ marginBottom: 8 }}>
//           <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Speed: {speed}</label>
//           <input type="range" min="0.0001" max="0.005" step="0.0001" value={speed} onChange={(e) => setSpeed(e.target.value)} onMouseUp={applySpeed} onTouchEnd={applySpeed} style={{ width: "100%" }} />
//         </div>

//         <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
//           <button onClick={handlePause} disabled={!sceneReady || !running} style={buttonStyle}>Pause</button>
//           <button onClick={handleResume} disabled={!sceneReady || running} style={buttonStyle}>Resume</button>
//           <button onClick={toggleComposer} disabled={!sceneReady} style={buttonStyle}>{composerOn ? "Composer Off" : "Composer On"}</button>
//         </div>

//         <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
//           <button onClick={handleLog} style={{ ...buttonStyle, flex: 1 }}>Log Scene</button>
//           <button onClick={() => { if (sceneObj && sceneObj.dispose) sceneObj.dispose(); setSceneReady(false); }} style={{ ...buttonStyle, background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#cfeefc" }}>Dispose</button>
//         </div>

//         <div style={{ marginTop: 10, fontSize: 11, color: "#9bd0df" }}>
//           Tip: use sliders then release (mouse up) to apply. Controls are dev-only (hidden in production).
//         </div>
//       </div>
//     </div>
//   )
// }

// const buttonStyle = {
//   padding: "6px 8px",
//   fontSize: 12,
//   borderRadius: 6,
//   background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
//   border: "1px solid rgba(255,255,255,0.06)",
//   color: "#cfeefc",
//   cursor: "pointer",
// }

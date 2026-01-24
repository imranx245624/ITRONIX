"use client"

import { useEffect, useRef } from "react"

/**
 * CanvasBackground
 * - Dynamically imports and initializes the Three.js scene from lib/three/scene.js
 * - Auto-tunes for mobile (reduces particle/node count)
 * - Pauses when document hidden to save CPU
 * - pointer-events: none so content above remains clickable
 *
 * Usage:
 * <div className="relative">
 *   <CanvasBackground />
 *   <div className="relative z-10">Your UI content</div>
 * </div>
 */
export default function CanvasBackground({
  className = "",
  // override tuning if needed
  desktop = { particleCount: 160, nodeCount: 40, lineDistance: 13 },
  mobile = { particleCount: 80, nodeCount: 20, lineDistance: 10 },
  disableBloomOnMobile = true,
}) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const rafState = useRef({ running: false })

  useEffect(() => {
    let mounted = true
    const canvas = canvasRef.current
    if (!canvas) return

    // style canvas to cover parent and not block pointer events
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    canvas.style.position = "absolute"
    canvas.style.left = "0"
    canvas.style.top = "0"
    canvas.style.zIndex = "0"
    canvas.style.pointerEvents = "none"

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    // choose options based on device
    const tuned = isMobile
      ? { particleCount: mobile.particleCount, nodeCount: mobile.nodeCount, lineDistance: mobile.lineDistance, bloom: disableBloomOnMobile ? { strength: 0.2, radius: 0.2, threshold: 0.9 } : undefined }
      : { particleCount: desktop.particleCount, nodeCount: desktop.nodeCount, lineDistance: desktop.lineDistance }

    let cleanupScene = null

    // lazy import to avoid bundling three.js in SSR
    ;(async () => {
      try {
        const mod = await import(/* webpackChunkName: "three-tech-scene" */ "@/lib/three/scene")
        if (!mounted) return
        const createTechScene = mod.createTechScene
        if (typeof createTechScene !== "function") {
          console.warn("createTechScene not found in module")
          return
        }

        // create scene instance
        sceneRef.current = createTechScene(canvas, tuned)
        // start animation loop
        sceneRef.current.start()
        rafState.current.running = true

        // expose cleanup function
        cleanupScene = () => {
          try {
            sceneRef.current?.dispose && sceneRef.current.dispose()
          } catch (e) {
            console.warn("Error disposing scene:", e)
          }
          sceneRef.current = null
        }
      } catch (err) {
        console.error("Failed to init three scene:", err)
      }
    })()

    // Pause/Resume when page visibility changes (save CPU)
    function onVisibilityChange() {
      if (!sceneRef.current) return
      if (document.hidden) {
        sceneRef.current.stop && sceneRef.current.stop()
        rafState.current.running = false
      } else {
        sceneRef.current.start && sceneRef.current.start()
        rafState.current.running = true
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange, false)

    // Optional: pause when window is resized to extremely small height (keyboard open on mobile)
    let resizeTimeout = null
    function onResize() {
      if (!sceneRef.current) return
      // throttle resize re-checks
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // if canvas is tiny, stop animation
        const rect = canvas.getBoundingClientRect()
        if (rect.width < 50 || rect.height < 50) {
          sceneRef.current.stop && sceneRef.current.stop()
          rafState.current.running = false
        } else if (!rafState.current.running) {
          sceneRef.current.start && sceneRef.current.start()
          rafState.current.running = true
        }
      }, 200)
    }
    window.addEventListener("resize", onResize, { passive: true })

    // Cleanup on unmount
    return () => {
      mounted = false
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("resize", onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      // dispose scene if created
      if (cleanupScene) {
        try {
          cleanupScene()
        } catch (e) {
          console.warn("cleanupScene error:", e)
        }
      } else if (sceneRef.current) {
        try {
          sceneRef.current.dispose && sceneRef.current.dispose()
        } catch (e) {
          console.warn("dispose error:", e)
        }
      }
    }
  }, [desktop, mobile, disableBloomOnMobile])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

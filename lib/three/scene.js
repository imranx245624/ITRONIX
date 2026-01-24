// lib/three/scene.js
// Three.js scene with post-processing bloom + subtle animated pulses.
// Exports createTechScene(canvas, opts) -> { start, stop, dispose, renderer, scene, camera }

import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

export function createTechScene(canvas, opts = {}) {
  if (typeof window === "undefined") throw new Error("createTechScene must run in browser")
  if (!canvas) throw new Error("Canvas element required")

  // ---------- options ----------
  const {
    particleCount = 140,
    nodeCount = 36,
    lineDistance = 12,
    bgColor = 0x000000, // changed from 0x05060a to pure black
    particleColor = 0x40f0ff, // neon-cyan
    nodeColor = 0xff66cc, // neon-magenta-ish
    speed = 0.0009,
    bloom = { strength: 0.9, radius: 0.6, threshold: 0.05 },
  } = opts

  // ---------- renderer ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(bgColor, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  // NOTE: avoid directly using sRGBEncoding or newer SRGBColorSpace here because
  // some three.js versions export different symbols and that causes build-time errors.
  // If you later want to add color-space handling, we can do a version-safe dynamic import.
  renderer.toneMapping = THREE.NoToneMapping

  // ---------- scene & camera ----------
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000)
  camera.position.set(0, 0, 55)

  // ---------- subtle ambient + rim light ----------
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.08)
  rimLight.position.set(-1, 2, 4)
  scene.add(rimLight)

  // ---------- groups ----------
  const world = new THREE.Group()
  scene.add(world)

  // ---------- particles ----------
  const particleGeo = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const r = 20 + Math.random() * 80
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    particlePositions[i * 3 + 0] = Math.cos(theta) * Math.sin(phi) * r
    particlePositions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r * 0.35
    particlePositions[i * 3 + 2] = Math.cos(phi) * r * 0.55
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
  const particleMat = new THREE.PointsMaterial({
    size: 0.9,
    transparent: true,
    opacity: 0.9,
    color: particleColor,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // ---------- nodes (glowing spheres) ----------
  const nodePositions = []
  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 50
    const y = (Math.random() - 0.5) * 18
    const z = (Math.random() - 0.5) * 30
    nodePositions.push(new THREE.Vector3(x, y, z))
  }

  const nodeGroup = new THREE.Group()
  const sphereGeo = new THREE.SphereGeometry(0.9, 12, 12)
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.4,
    emissive: new THREE.Color(nodeColor),
    emissiveIntensity: 0.9,
  })

  const spriteMap = generateSoftCircleTexture()
  const spriteMat = new THREE.SpriteMaterial({
    map: spriteMap,
    color: nodeColor,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  nodePositions.forEach((pos) => {
    const mesh = new THREE.Mesh(sphereGeo, nodeMat.clone())
    mesh.position.copy(pos)
    mesh.scale.setScalar(1)
    nodeGroup.add(mesh)

    const glow = new THREE.Sprite(spriteMat.clone())
    glow.position.copy(pos)
    glow.scale.set(4, 4, 1)
    nodeGroup.add(glow)
  })
  world.add(nodeGroup)

  // ---------- lines between nodes ----------
  function buildLines() {
    const positions = []
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const a = nodePositions[i]
        const b = nodePositions[j]
        const d = a.distanceTo(b)
        if (d < lineDistance) {
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
        }
      }
    }
    if (positions.length === 0) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))
    const mat = new THREE.LineBasicMaterial({
      color: particleColor,
      transparent: true,
      opacity: 0.12,
      linewidth: 1,
    })
    const lines = new THREE.LineSegments(geo, mat)
    return lines
  }

  let linesMesh = buildLines()
  if (linesMesh) world.add(linesMesh)

  // ---------- postprocessing (bloom) ----------
  let composer = null
  let renderPass = null
  let bloomPass = null
  let useComposer = true

  try {
    composer = new EffectComposer(renderer)
    renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), bloom.strength, bloom.radius, bloom.threshold)
    bloomPass.enabled = true
    composer.addPass(bloomPass)
  } catch (err) {
    console.warn("Postprocessing init failed, falling back to simple render:", err)
    composer = null
    useComposer = false
  }

  // ---------- resize helper ----------
  function resizeRendererToDisplaySize() {
    const width = canvas.clientWidth || 300
    const height = canvas.clientHeight || 150
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const needResize = canvas.width !== Math.floor(width * pixelRatio) || canvas.height !== Math.floor(height * pixelRatio)
    if (needResize) {
      renderer.setSize(width, height, false)
      const ar = width / height || 1
      camera.aspect = ar
      camera.updateProjectionMatrix()
      if (composer) composer.setSize(width, height)
    }
    return needResize
  }

  // ---------- animation variables ----------
  let rafId = null
  let t = 0
  const baseSpeed = speed

  const nodeMeshes = nodeGroup.children.filter((c) => c.type === "Mesh")
  const glowSprites = nodeGroup.children.filter((c) => c.type === "Sprite")

  function animate() {
    rafId = requestAnimationFrame(animate)
    t += baseSpeed * 60

    world.rotation.y = Math.sin(t * 0.03) * 0.06
    world.rotation.x = Math.sin(t * 0.01) * 0.02

    nodeMeshes.forEach((m, idx) => {
      const s = 1 + Math.sin(t * 0.7 + idx) * 0.06
      m.scale.setScalar(s)
      const base = nodePositions[idx]
      m.position.x = base.x + Math.sin(t * 0.12 + idx) * 0.12
      m.position.y = base.y + Math.cos(t * 0.14 + idx) * 0.08
      if (m.material && m.material.emissive) {
        m.material.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 0.9 + idx)) * 0.9
      }
    })

    glowSprites.forEach((s, i) => {
      const mesh = nodeMeshes[i]
      s.position.copy(mesh.position)
      const scale = 3.5 + Math.abs(Math.sin(t * 0.9 + i)) * 1.6
      s.scale.set(scale, scale, 1)
      s.material.opacity = 0.06 + Math.abs(Math.sin(t * 0.9 + i)) * 0.12
    })

    particles.rotation.y += 0.0008

    camera.position.x = Math.sin(t * 0.02) * 0.6
    camera.position.y = Math.cos(t * 0.015) * 0.25
    camera.lookAt(0, 0, 0)

    resizeRendererToDisplaySize()

    if (useComposer && composer) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  function start() {
    if (!rafId) animate()
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function dispose() {
    stop()
    try {
      particleGeo.dispose()
      particleMat.dispose()
    } catch (e) {}
    try {
      sphereGeo.dispose()
      nodeGroup.children.forEach((c) => {
        if (c.material) {
          c.material.dispose && c.material.dispose()
        }
        if (c.geometry) {
          c.geometry.dispose && c.geometry.dispose()
        }
      })
    } catch (e) {}
    try {
      if (linesMesh) {
        linesMesh.geometry.dispose()
        linesMesh.material.dispose()
      }
    } catch (e) {}
    if (composer) {
      composer.dispose && composer.dispose()
    }
    renderer.dispose && renderer.dispose()
  }

  // utility: create a soft circular texture for glow sprites
  function generateSoftCircleTexture() {
    const size = 128
    const canvasTex = document.createElement("canvas")
    canvasTex.width = size
    canvasTex.height = size
    const ctx = canvasTex.getContext("2d")
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, "rgba(255,255,255,1.0)")
    grad.addColorStop(0.2, "rgba(255,255,255,0.85)")
    grad.addColorStop(0.4, "rgba(255,255,255,0.65)")
    grad.addColorStop(1, "rgba(255,255,255,0.0)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const texture = new THREE.CanvasTexture(canvasTex)
    texture.needsUpdate = true
    return texture
  }

  return {
    start,
    stop,
    dispose,
    renderer,
    scene,
    camera,
    setBloom: (s = 0.9, r = 0.6, thresh = 0.05) => {
      if (bloomPass) {
        bloomPass.strength = s
        bloomPass.radius = r
        bloomPass.threshold = thresh
      }
    },
  }
}

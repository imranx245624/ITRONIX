export function initCanvasAnimation(canvas) {
  if (!canvas) return () => {}

  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}

  // Detect mobile for performance optimization
  const isMobile = window.innerWidth < 768

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()

  // Particle system
  const particles = []
  const beams = []
  const colors = ["#00D1C1", "#FF4EC8", "#FF8C42", "#C8FFF1"]

  // Initialize particles (reduced count on mobile)
  const particleCount = isMobile ? 25 : 50
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  // Initialize beams (reduced on mobile)
  const beamCount = isMobile ? 1 : 3
  for (let i = 0; i < beamCount; i++) {
    beams.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      length: Math.random() * 300 + 200,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  let mouseX = canvas.width / 2
  let mouseY = canvas.height / 2

  // Track mouse for parallax
  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  window.addEventListener("mousemove", handleMouseMove)

  function drawParticles() {
    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      // Keep in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x))
      particle.y = Math.max(0, Math.min(canvas.height, particle.y))

      // Draw particle
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw connection lines (skip on mobile for performance)
      if (!isMobile) {
        particles.forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x
          const dy = otherParticle.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - distance / 150) * 0.2
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      }
    })
  }

  function drawBeams() {
    beams.forEach((beam) => {
      beam.angle += 0.002
      beam.opacity = Math.sin(Date.now() * 0.003 + Math.random()) * 0.2 + 0.1

      const endX = beam.x + Math.cos(beam.angle) * beam.length
      const endY = beam.y + Math.sin(beam.angle) * beam.length

      ctx.strokeStyle = beam.color
      ctx.globalAlpha = beam.opacity
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(beam.x, beam.y)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Glow effect (reduced on mobile)
      if (!isMobile) {
        ctx.strokeStyle = beam.color
        ctx.globalAlpha = beam.opacity * 0.5
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(beam.x, beam.y)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    })
  }

  function drawHoloBlobsAnimation() {
    // Animated holographic blobs
    for (let i = 0; i < 2; i++) {
      const time = Date.now() * 0.0005
      const x = canvas.width * (0.3 + Math.sin(time + i) * 0.2)
      const y = canvas.height * (0.3 + Math.cos(time + i * 1.5) * 0.2)
      const size = 100 + Math.sin(time * 2 + i) * 30

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, colors[i] + "30")
      gradient.addColorStop(0.7, colors[i + 2] + "10")
      gradient.addColorStop(1, colors[i] + "00")

      ctx.globalAlpha = 0.3
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function animate() {
    // Clear canvas with fade effect
    ctx.fillStyle = "#04040B"
    ctx.globalAlpha = 0.1
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.globalAlpha = 1

    // Draw grid overlay (skip on mobile)
    if (!isMobile) {
      ctx.strokeStyle = "#00D1C1"
      ctx.globalAlpha = 0.05
      ctx.lineWidth = 1
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    drawHoloBlobsAnimation()
    drawBeams()
    drawParticles()

    requestAnimationFrame(animate)
  }

  animate()

  const handleResize = () => {
    resizeCanvas()
  }

  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("resize", handleResize)
  }
}

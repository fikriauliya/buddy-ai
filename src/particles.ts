// ===== CANVAS PARTICLE SYSTEM =====
interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number; color: string
  type: 'confetti' | 'star' | 'sparkle'
  rotation: number; rotSpeed: number
}

const particles: Particle[] = []
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let animId = 0

export function initParticles() {
  canvas = document.getElementById('particles') as HTMLCanvasElement
  if (!canvas) return
  ctx = canvas.getContext('2d')!
  resize()
  window.addEventListener('resize', resize)
  loop()
}

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.15 // gravity
    p.life--
    p.rotation += p.rotSpeed

    const alpha = Math.max(0, p.life / p.maxLife)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)

    if (p.type === 'confetti') {
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    } else if (p.type === 'star') {
      ctx.fillStyle = p.color
      ctx.font = `${p.size}px sans-serif`
      ctx.fillText('⭐', -p.size / 2, p.size / 2)
    } else {
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()

    if (p.life <= 0) particles.splice(i, 1)
  }

  animId = requestAnimationFrame(loop)
}

const COLORS = ['#FFD93D', '#6BCB77', '#FF6B9D', '#4A9EE0', '#9B59B6', '#FF8C42', '#FF6B6B']
const isMobile = () => window.innerWidth <= 480

export function burstConfetti(x?: number, y?: number) {
  const cx = x ?? window.innerWidth / 2
  const cy = y ?? window.innerHeight / 3
  const count = isMobile() ? 25 : 60
  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1) * 10 - 2,
      life: 80 + Math.random() * 40,
      maxLife: 120,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: Math.random() > 0.7 ? 'star' : 'confetti',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2
    })
  }
}

export function burstStars(x: number, y: number, count = 8) {
  const actualCount = isMobile() ? Math.min(count, 4) : count
  for (let i = 0; i < actualCount; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 50 + Math.random() * 30,
      maxLife: 80,
      size: 14 + Math.random() * 8,
      color: '#FFD93D',
      type: 'star',
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.1
    })
  }
}

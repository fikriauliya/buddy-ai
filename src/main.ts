import './style.css'
import { createBuddyCharacter } from './character'
import { Effect, Stream, Schedule } from 'effect'

// ========== CHARACTER INJECTION ==========
const heroChar = document.getElementById('heroCharacter')
if (heroChar) {
  heroChar.innerHTML = createBuddyCharacter()
  // Add sparkles around character
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div')
    sparkle.className = 'sparkle'
    sparkle.style.left = `${Math.random() * 100}%`
    sparkle.style.top = `${Math.random() * 100}%`
    sparkle.style.animationDelay = `${Math.random() * 3}s`
    sparkle.style.animationDuration = `${2 + Math.random() * 2}s`
    sparkle.style.width = `${3 + Math.random() * 6}px`
    sparkle.style.height = sparkle.style.width
    heroChar.appendChild(sparkle)
  }
}

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar')!

const scrollEffect = Effect.sync(() => {
  navbar.classList.toggle('scrolled', window.scrollY > 50)
})

window.addEventListener('scroll', () => {
  Effect.runSync(scrollEffect)
}, { passive: true })

// ========== MOBILE NAV TOGGLE ==========
const navToggle = document.getElementById('navToggle')!
const navLinks = document.getElementById('navLinks')!

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open')
})

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'))
})

// ========== INTERSECTION OBSERVER (Effect TS) ==========
const observeElements = Effect.sync(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          
          // Trigger wave animation on buddy character
          const buddy = document.querySelector('.buddy-svg')
          if (entry.target.closest('.hero') && buddy) {
            buddy.classList.add('waving')
            setTimeout(() => buddy.classList.remove('waving'), 2000)
          }
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  return observer
})

Effect.runSync(observeElements)

// ========== TABS ==========
const tabsContainer = document.getElementById('blocksTabs')
if (tabsContainer) {
  tabsContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.classList.contains('tab')) return

    const tabName = target.dataset.tab!

    // Update active tab
    tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    target.classList.add('active')

    // Update active panel
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
    document.getElementById(`panel-${tabName}`)?.classList.add('active')
  })
}

// ========== HERO PARTICLES (Canvas) ==========
const createParticles = Effect.sync(() => {
  const container = document.getElementById('heroParticles')!
  const canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  
  interface Particle {
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; hue: number;
  }

  let particles: Particle[] = []
  let w = 0, h = 0

  function resize() {
    w = canvas.width = container.offsetWidth
    h = canvas.height = container.offsetHeight
  }

  function init() {
    resize()
    particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3 - 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 210 : 45,
    }))
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`
      ctx.fill()

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) { p.y = h; p.vy = -(Math.random() * 0.3 + 0.2) }
    })
    requestAnimationFrame(draw)
  }

  init()
  draw()
  window.addEventListener('resize', resize, { passive: true })
})

Effect.runSync(createParticles)

// ========== PERIODIC BLINK SCHEDULE (Effect TS Stream) ==========
const buddySvg = document.querySelector('.buddy-svg')
if (buddySvg) {
  // Use Effect Schedule for periodic wave trigger
  const waveProgram = Effect.gen(function* () {
    const stream = Stream.fromSchedule(Schedule.spaced('8 seconds'))
    yield* Stream.runForEach(stream, () =>
      Effect.sync(() => {
        if (document.visibilityState === 'visible') {
          buddySvg.classList.add('waving')
          setTimeout(() => buddySvg.classList.remove('waving'), 2000)
        }
      })
    )
  })

  Effect.runFork(waveProgram)
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!)
    target?.scrollIntoView({ behavior: 'smooth' })
  })
})

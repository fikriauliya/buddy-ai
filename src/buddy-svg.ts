// ===== BUDDY SVG ROBOT CHARACTER =====
export type BuddyState = 'idle' | 'talking' | 'listening' | 'celebrating' | 'thinking' | 'encouraging'

export function createBuddySVG(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 200 240')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.id = 'buddy-svg'

  svg.innerHTML = `
    <defs>
      <radialGradient id="bodyGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="#6BB5F0"/>
        <stop offset="100%" stop-color="#4A9EE0"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="cheekGrad">
        <stop offset="0%" stop-color="#FFB3C6" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#FFB3C6" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Floating sparkles -->
    <g id="sparkles">
      <circle class="sparkle" cx="30" cy="60" r="2" fill="#FFD93D" opacity="0.6"/>
      <circle class="sparkle" cx="170" cy="80" r="2.5" fill="#FFD93D" opacity="0.5"/>
      <circle class="sparkle" cx="25" cy="160" r="1.5" fill="#6BCB77" opacity="0.5"/>
      <circle class="sparkle" cx="175" cy="150" r="2" fill="#FF6B9D" opacity="0.4"/>
    </g>

    <!-- Main body group (for floating animation) -->
    <g id="buddy-body">
      <!-- Antenna -->
      <line id="antenna-stem" x1="100" y1="55" x2="100" y2="30" stroke="#4A9EE0" stroke-width="4" stroke-linecap="round"/>
      <circle id="antenna-tip" cx="100" cy="25" r="8" fill="#FFD93D" filter="url(#glow)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>

      <!-- Body -->
      <ellipse cx="100" cy="140" rx="65" ry="70" fill="url(#bodyGrad)" stroke="#3A8DD0" stroke-width="2"/>

      <!-- Belly circle -->
      <ellipse cx="100" cy="155" rx="30" ry="25" fill="#5AAFE8" opacity="0.5"/>

      <!-- Left arm -->
      <g id="left-arm" transform-origin="45 130">
        <path d="M 45 130 Q 20 130 15 145" stroke="#4A9EE0" stroke-width="12" stroke-linecap="round" fill="none"/>
        <circle cx="14" cy="148" r="8" fill="#4A9EE0"/>
      </g>

      <!-- Right arm -->
      <g id="right-arm" transform-origin="155 130">
        <path d="M 155 130 Q 180 130 185 145" stroke="#4A9EE0" stroke-width="12" stroke-linecap="round" fill="none"/>
        <circle cx="186" cy="148" r="8" fill="#4A9EE0"/>
      </g>

      <!-- Face plate -->
      <ellipse cx="100" cy="110" rx="48" ry="42" fill="#E8F4FD" stroke="#B8D9F0" stroke-width="1.5"/>

      <!-- Eyes -->
      <g id="eyes">
        <g id="left-eye">
          <ellipse cx="80" cy="103" rx="14" ry="15" fill="white" stroke="#ddd" stroke-width="1"/>
          <circle id="left-iris" cx="80" cy="105" r="8" fill="#4A9EE0"/>
          <circle cx="80" cy="105" r="4" fill="#2C3E50"/>
          <circle cx="84" cy="100" r="3" fill="white" opacity="0.8"/>
        </g>
        <g id="right-eye">
          <ellipse cx="120" cy="103" rx="14" ry="15" fill="white" stroke="#ddd" stroke-width="1"/>
          <circle id="right-iris" cx="120" cy="105" r="8" fill="#4A9EE0"/>
          <circle cx="120" cy="105" r="4" fill="#2C3E50"/>
          <circle cx="124" cy="100" r="3" fill="white" opacity="0.8"/>
        </g>
      </g>

      <!-- Eyelids (for blinking) -->
      <g id="eyelids" opacity="0">
        <ellipse cx="80" cy="103" rx="14" ry="15" fill="#E8F4FD"/>
        <ellipse cx="120" cy="103" rx="14" ry="15" fill="#E8F4FD"/>
      </g>

      <!-- Cheeks -->
      <ellipse cx="60" cy="118" rx="10" ry="7" fill="url(#cheekGrad)"/>
      <ellipse cx="140" cy="118" rx="10" ry="7" fill="url(#cheekGrad)"/>

      <!-- Mouth -->
      <g id="mouth">
        <path id="mouth-shape" d="M 85 125 Q 100 138 115 125" stroke="#3A8DD0" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>

      <!-- Feet -->
      <ellipse cx="78" cy="210" rx="18" ry="10" fill="#4A9EE0" stroke="#3A8DD0" stroke-width="1.5"/>
      <ellipse cx="122" cy="210" rx="18" ry="10" fill="#4A9EE0" stroke="#3A8DD0" stroke-width="1.5"/>
    </g>

    <!-- Thinking dots -->
    <g id="thinking-dots" opacity="0">
      <circle cx="150" cy="70" r="4" fill="#aaa"/>
      <circle cx="165" cy="60" r="5" fill="#bbb"/>
      <circle cx="182" cy="48" r="6" fill="#ccc"/>
    </g>

    <!-- Celebration elements -->
    <g id="celebration" opacity="0">
      <text x="40" y="30" font-size="20">⭐</text>
      <text x="140" y="25" font-size="18">🌟</text>
      <text x="160" y="50" font-size="16">✨</text>
      <text x="20" y="50" font-size="14">🎉</text>
    </g>

    <style>
      #buddy-body {
        animation: buddyFloat 3s ease-in-out infinite;
      }
      @keyframes buddyFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .sparkle {
        animation: sparkleAnim 2s ease-in-out infinite;
      }
      .sparkle:nth-child(2) { animation-delay: 0.5s; }
      .sparkle:nth-child(3) { animation-delay: 1s; }
      .sparkle:nth-child(4) { animation-delay: 1.5s; }
      @keyframes sparkleAnim {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.5); }
      }
    </style>
  `
  return svg
}

let blinkInterval: number | null = null
let talkInterval: number | null = null

export function setBuddyState(state: BuddyState) {
  const svg = document.getElementById('buddy-svg')
  if (!svg) return

  // Clear intervals
  if (blinkInterval) { clearInterval(blinkInterval); blinkInterval = null }
  if (talkInterval) { clearInterval(talkInterval); talkInterval = null }

  const eyelids = svg.querySelector('#eyelids') as SVGElement
  const mouth = svg.querySelector('#mouth-shape') as SVGElement
  const thinkDots = svg.querySelector('#thinking-dots') as SVGElement
  const celebration = svg.querySelector('#celebration') as SVGElement
  const leftArm = svg.querySelector('#left-arm') as SVGElement
  const rightArm = svg.querySelector('#right-arm') as SVGElement
  const antennaTip = svg.querySelector('#antenna-tip') as SVGElement
  const body = svg.querySelector('#buddy-body') as SVGElement

  // Reset all
  if (eyelids) eyelids.setAttribute('opacity', '0')
  if (thinkDots) thinkDots.setAttribute('opacity', '0')
  if (celebration) celebration.setAttribute('opacity', '0')
  if (leftArm) leftArm.style.transform = ''
  if (rightArm) rightArm.style.transform = ''
  if (body) body.style.animation = 'buddyFloat 3s ease-in-out infinite'
  if (mouth) mouth.setAttribute('d', 'M 85 125 Q 100 138 115 125')
  if (antennaTip) antennaTip.setAttribute('fill', '#FFD93D')

  // Start blinking for all states
  blinkInterval = window.setInterval(() => {
    if (eyelids) {
      eyelids.setAttribute('opacity', '1')
      setTimeout(() => eyelids.setAttribute('opacity', '0'), 150)
    }
  }, 3000)

  switch (state) {
    case 'idle':
      break

    case 'talking':
      // Mouth animation
      talkInterval = window.setInterval(() => {
        if (mouth) {
          const open = mouth.getAttribute('d')?.includes('138')
          mouth.setAttribute('d', open
            ? 'M 85 125 Q 100 130 115 125'
            : 'M 85 125 Q 100 138 115 125')
        }
      }, 200)
      // Slight bounce
      if (body) body.style.animation = 'buddyFloat 1s ease-in-out infinite'
      break

    case 'listening':
      // Antenna lights up
      if (antennaTip) antennaTip.setAttribute('fill', '#FF6B6B')
      // Lean forward
      if (body) body.style.transform = 'rotate(-3deg)'
      // Big open mouth (listening)
      if (mouth) mouth.setAttribute('d', 'M 88 125 Q 100 132 112 125')
      break

    case 'celebrating':
      if (celebration) celebration.setAttribute('opacity', '1')
      // Arms up
      if (leftArm) leftArm.style.transform = 'rotate(-30deg)'
      if (rightArm) rightArm.style.transform = 'rotate(30deg)'
      // Big smile
      if (mouth) mouth.setAttribute('d', 'M 82 122 Q 100 142 118 122')
      // Bounce
      if (body) body.style.animation = 'buddyFloat 0.5s ease-in-out infinite'
      break

    case 'thinking':
      if (thinkDots) thinkDots.setAttribute('opacity', '1')
      // Head tilt
      if (body) body.style.transform = 'rotate(5deg)'
      // Hmm mouth
      if (mouth) mouth.setAttribute('d', 'M 92 127 Q 100 130 108 127')
      break

    case 'encouraging':
      // Thumbs up (right arm up)
      if (rightArm) rightArm.style.transform = 'rotate(25deg)'
      // Smile
      if (mouth) mouth.setAttribute('d', 'M 83 123 Q 100 140 117 123')
      // Nod
      if (body) body.style.animation = 'buddyFloat 0.8s ease-in-out infinite'
      break
  }
}

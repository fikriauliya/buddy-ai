export function createBuddyCharacter(): string {
  return `
  <svg viewBox="0 0 300 360" class="buddy-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bodyGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="#5FA3E6"/>
        <stop offset="100%" stop-color="#3A7BC8"/>
      </radialGradient>
      <radialGradient id="glowGrad" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#FFD700" stop-opacity="1"/>
        <stop offset="100%" stop-color="#FFB800" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4A90D9" flood-opacity="0.2"/>
      </filter>
    </defs>

    <g class="body" filter="url(#shadow)">
      <!-- Antenna -->
      <rect x="145" y="40" width="10" height="40" rx="5" fill="#4A90D9"/>
      <circle class="antenna-glow" cx="150" cy="36" r="8" fill="url(#glowGrad)"/>
      <circle cx="150" cy="36" r="5" fill="#FFB800"/>

      <!-- Ears -->
      <rect x="60" y="110" width="16" height="40" rx="8" fill="#3A7BC8"/>
      <rect x="224" y="110" width="16" height="40" rx="8" fill="#3A7BC8"/>

      <!-- Head/Body (rounded robot) -->
      <rect x="82" y="75" width="136" height="130" rx="40" fill="url(#bodyGrad)"/>

      <!-- Face plate -->
      <rect x="100" y="95" width="100" height="80" rx="28" fill="white" opacity="0.9"/>

      <!-- Eyes -->
      <g class="eye-left">
        <circle cx="130" cy="128" r="14" fill="white"/>
        <circle cx="132" cy="126" r="8" fill="#2D2D2D"/>
        <circle cx="135" cy="123" r="3" fill="white"/>
      </g>
      <g class="eye-right">
        <circle cx="170" cy="128" r="14" fill="white"/>
        <circle cx="172" cy="126" r="8" fill="#2D2D2D"/>
        <circle cx="175" cy="123" r="3" fill="white"/>
      </g>

      <!-- Mouth (smile) -->
      <path d="M130 152 Q150 168 170 152" stroke="#2D2D2D" stroke-width="3" fill="none" stroke-linecap="round"/>

      <!-- Cheeks -->
      <circle cx="112" cy="148" r="8" fill="#FF9EAA" opacity="0.5"/>
      <circle cx="188" cy="148" r="8" fill="#FF9EAA" opacity="0.5"/>

      <!-- Body lower -->
      <rect x="100" y="200" width="100" height="80" rx="30" fill="url(#bodyGrad)"/>

      <!-- Belly button / heart -->
      <circle cx="150" cy="235" r="14" fill="#FFB800" opacity="0.8"/>
      <text x="150" y="241" text-anchor="middle" font-size="16" fill="white">♥</text>

      <!-- Left arm -->
      <g>
        <rect x="64" y="210" width="38" height="14" rx="7" fill="#3A7BC8"/>
        <circle cx="60" cy="217" r="10" fill="#3A7BC8"/>
      </g>

      <!-- Right arm (waving) -->
      <g class="hand-right">
        <rect x="198" y="210" width="38" height="14" rx="7" fill="#3A7BC8"/>
        <circle cx="240" cy="217" r="10" fill="#3A7BC8"/>
      </g>

      <!-- Feet -->
      <ellipse cx="128" cy="282" rx="22" ry="12" fill="#3A7BC8"/>
      <ellipse cx="172" cy="282" rx="22" ry="12" fill="#3A7BC8"/>

      <!-- Shoe accents -->
      <ellipse cx="128" cy="280" rx="16" ry="6" fill="#FFB800" opacity="0.6"/>
      <ellipse cx="172" cy="280" rx="16" ry="6" fill="#FFB800" opacity="0.6"/>
    </g>
  </svg>`;
}

export function createMiniCharacter(): string {
  return `<svg viewBox="0 0 60 72" class="buddy-mini" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="28" y="4" width="4" height="10" rx="2" fill="#4A90D9"/>
      <circle cx="30" cy="4" r="3" fill="#FFB800"/>
      <rect x="12" y="18" width="36" height="32" rx="12" fill="#4A90D9"/>
      <rect x="18" y="24" width="24" height="18" rx="8" fill="white" opacity="0.9"/>
      <circle cx="25" cy="32" r="3" fill="#2D2D2D"/>
      <circle cx="35" cy="32" r="3" fill="#2D2D2D"/>
      <path d="M24 38 Q30 42 36 38" stroke="#2D2D2D" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <rect x="18" y="48" width="24" height="16" rx="8" fill="#4A90D9"/>
      <circle cx="30" cy="55" r="4" fill="#FFB800" opacity="0.6"/>
    </g>
  </svg>`;
}

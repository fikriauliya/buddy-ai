// ===== SVG BUDDY CHARACTER =====

export type BuddyState = "idle" | "talking" | "listening" | "celebrating" | "thinking" | "waving";

export function createBuddySVG(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 200 260");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.id = "buddy-svg";
  svg.innerHTML = `
    <defs>
      <radialGradient id="bodyGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="#81D4FA"/>
        <stop offset="100%" stop-color="#4FC3F7"/>
      </radialGradient>
      <radialGradient id="headGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="#90CAF9"/>
        <stop offset="100%" stop-color="#64B5F6"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
      </filter>
    </defs>

    <!-- Antenna -->
    <g id="antenna" filter="url(#shadow)">
      <line x1="100" y1="45" x2="100" y2="15" stroke="#FFD54F" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="12" r="8" fill="#FFD54F">
        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="12" r="4" fill="#FFF9C4" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </g>

    <!-- Body bounce group -->
    <g id="buddy-body-group">
      <!-- Body -->
      <ellipse cx="100" cy="180" rx="55" ry="60" fill="url(#bodyGrad)" filter="url(#shadow)"/>
      <!-- Body shine -->
      <ellipse cx="80" cy="160" rx="20" ry="25" fill="white" opacity="0.15"/>
      <!-- Belly circle -->
      <circle cx="100" cy="190" r="22" fill="#B3E5FC" opacity="0.5"/>
      <!-- Heart on belly -->
      <text x="100" y="196" text-anchor="middle" font-size="18" opacity="0.6">❤️</text>

      <!-- Head -->
      <g id="head">
        <ellipse cx="100" cy="90" rx="50" ry="45" fill="url(#headGrad)" filter="url(#shadow)"/>
        <!-- Head shine -->
        <ellipse cx="82" cy="72" rx="18" ry="14" fill="white" opacity="0.2"/>

        <!-- Eyes -->
        <g id="eyes">
          <g id="left-eye">
            <ellipse cx="80" cy="85" rx="14" ry="15" fill="white"/>
            <circle id="left-pupil" cx="80" cy="87" r="7" fill="#333"/>
            <circle cx="76" cy="83" r="3" fill="white" opacity="0.8"/>
          </g>
          <g id="right-eye">
            <ellipse cx="120" cy="85" rx="14" ry="15" fill="white"/>
            <circle id="right-pupil" cx="120" cy="87" r="7" fill="#333"/>
            <circle cx="116" cy="83" r="3" fill="white" opacity="0.8"/>
          </g>
          <!-- Blink overlay -->
          <g id="blink" opacity="0">
            <ellipse cx="80" cy="85" rx="14" ry="15" fill="#64B5F6"/>
            <ellipse cx="120" cy="85" rx="14" ry="15" fill="#64B5F6"/>
          </g>
        </g>

        <!-- Eyebrows -->
        <g id="eyebrows">
          <line id="left-brow" x1="68" y1="67" x2="90" y2="65" stroke="#333" stroke-width="3" stroke-linecap="round"/>
          <line id="right-brow" x1="110" y1="65" x2="132" y2="67" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        </g>

        <!-- Mouth -->
        <g id="mouth">
          <path id="mouth-path" d="M 82 105 Q 100 120 118 105" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
        </g>
        
        <!-- Cheeks -->
        <circle cx="62" cy="100" r="8" fill="#F48FB1" opacity="0.3"/>
        <circle cx="138" cy="100" r="8" fill="#F48FB1" opacity="0.3"/>
      </g>

      <!-- Left arm -->
      <g id="left-arm">
        <path d="M 50 160 Q 25 170 20 190" stroke="#4FC3F7" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="18" cy="192" r="10" fill="#4FC3F7"/>
      </g>
      <!-- Right arm -->
      <g id="right-arm">
        <path d="M 150 160 Q 175 170 180 190" stroke="#4FC3F7" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="182" cy="192" r="10" fill="#4FC3F7"/>
      </g>

      <!-- Feet -->
      <ellipse cx="75" cy="238" rx="22" ry="12" fill="#29B6F6" filter="url(#shadow)"/>
      <ellipse cx="125" cy="238" rx="22" ry="12" fill="#29B6F6" filter="url(#shadow)"/>
    </g>

    <!-- Stars around (hidden by default) -->
    <g id="stars" opacity="0">
      <text x="30" y="50" font-size="20">⭐</text>
      <text x="160" y="40" font-size="16">✨</text>
      <text x="170" y="110" font-size="18">🌟</text>
      <text x="15" y="120" font-size="14">✨</text>
    </g>
  `;
  return svg;
}

let blinkInterval: number | undefined;
let bounceInterval: number | undefined;
let currentState: BuddyState = "idle";

export function setBuddyState(state: BuddyState) {
  currentState = state;
  const svg = document.getElementById("buddy-svg");
  if (!svg) return;

  const mouth = svg.querySelector("#mouth-path") as SVGPathElement | null;
  const blink = svg.querySelector("#blink") as SVGGElement | null;
  const stars = svg.querySelector("#stars") as SVGGElement | null;
  const leftArm = svg.querySelector("#left-arm") as SVGGElement | null;
  const rightArm = svg.querySelector("#right-arm") as SVGGElement | null;
  const bodyGroup = svg.querySelector("#buddy-body-group") as SVGGElement | null;
  const leftBrow = svg.querySelector("#left-brow") as SVGLineElement | null;
  const rightBrow = svg.querySelector("#right-brow") as SVGLineElement | null;

  // Reset
  if (bounceInterval) { clearInterval(bounceInterval); bounceInterval = undefined; }
  if (bodyGroup) bodyGroup.style.transform = "";
  if (leftArm) leftArm.style.transform = "";
  if (rightArm) rightArm.style.transform = "";
  if (stars) stars.setAttribute("opacity", "0");

  // Blink animation
  if (blinkInterval) clearInterval(blinkInterval);
  blinkInterval = window.setInterval(() => {
    if (blink) {
      blink.setAttribute("opacity", "1");
      setTimeout(() => blink.setAttribute("opacity", "0"), 150);
    }
  }, 3000 + Math.random() * 2000);

  switch (state) {
    case "idle":
      if (mouth) mouth.setAttribute("d", "M 82 105 Q 100 120 118 105");
      gentleBounce(bodyGroup);
      break;

    case "talking":
      talkingMouth(mouth);
      gentleBounce(bodyGroup);
      break;

    case "listening":
      if (mouth) mouth.setAttribute("d", "M 88 108 Q 100 112 112 108"); // small o
      if (leftBrow) { leftBrow.setAttribute("y1", "63"); leftBrow.setAttribute("y2", "61"); }
      if (rightBrow) { rightBrow.setAttribute("y1", "61"); rightBrow.setAttribute("y2", "63"); }
      // Subtle head tilt
      if (bodyGroup) {
        bodyGroup.style.transition = "transform 0.5s ease";
        bodyGroup.style.transform = "rotate(-3deg)";
      }
      break;

    case "celebrating":
      if (mouth) mouth.setAttribute("d", "M 78 102 Q 100 128 122 102");
      if (stars) {
        stars.setAttribute("opacity", "1");
        animateStars(stars);
      }
      celebrateArms(leftArm, rightArm);
      celebrateBounce(bodyGroup);
      break;

    case "thinking":
      if (mouth) mouth.setAttribute("d", "M 90 110 L 110 108");
      if (leftBrow) { leftBrow.setAttribute("y1", "62"); }
      if (bodyGroup) {
        bodyGroup.style.transition = "transform 0.8s ease";
        bodyGroup.style.transform = "rotate(5deg)";
      }
      break;

    case "waving":
      if (mouth) mouth.setAttribute("d", "M 82 105 Q 100 120 118 105");
      waveArm(rightArm);
      gentleBounce(bodyGroup);
      break;
  }
}

function gentleBounce(el: SVGGElement | null) {
  if (!el) return;
  let up = true;
  bounceInterval = window.setInterval(() => {
    el.style.transition = "transform 0.8s ease";
    el.style.transform = up ? "translateY(-4px)" : "translateY(0)";
    up = !up;
  }, 800);
}

function celebrateBounce(el: SVGGElement | null) {
  if (!el) return;
  let up = true;
  bounceInterval = window.setInterval(() => {
    el.style.transition = "transform 0.3s ease";
    el.style.transform = up ? "translateY(-12px) scale(1.05)" : "translateY(0) scale(1)";
    up = !up;
  }, 300);
}

let talkingTimer: number | undefined;
function talkingMouth(mouth: SVGPathElement | null) {
  if (!mouth) return;
  if (talkingTimer) clearInterval(talkingTimer);
  const shapes = [
    "M 82 105 Q 100 120 118 105",
    "M 85 106 Q 100 116 115 106",
    "M 88 108 Q 100 118 112 108",
  ];
  let i = 0;
  talkingTimer = window.setInterval(() => {
    if (currentState !== "talking") { clearInterval(talkingTimer); return; }
    mouth.setAttribute("d", shapes[i % shapes.length]);
    i++;
  }, 200);
}

function waveArm(arm: SVGGElement | null) {
  if (!arm) return;
  let up = true;
  const wave = () => {
    arm.style.transition = "transform 0.4s ease";
    arm.style.transformOrigin = "150px 160px";
    arm.style.transform = up ? "rotate(-30deg)" : "rotate(0deg)";
    up = !up;
  };
  wave();
  const id = setInterval(() => {
    if (currentState !== "waving") { clearInterval(id); arm.style.transform = ""; return; }
    wave();
  }, 400);
}

function celebrateArms(left: SVGGElement | null, right: SVGGElement | null) {
  if (left) {
    left.style.transition = "transform 0.3s ease";
    left.style.transformOrigin = "50px 160px";
    left.style.transform = "rotate(30deg)";
  }
  if (right) {
    right.style.transition = "transform 0.3s ease";
    right.style.transformOrigin = "150px 160px";
    right.style.transform = "rotate(-30deg)";
  }
}

function animateStars(stars: SVGGElement) {
  const texts = stars.querySelectorAll("text");
  texts.forEach((t, i) => {
    t.style.transition = "none";
    t.style.opacity = "0";
    setTimeout(() => {
      t.style.transition = "opacity 0.3s, transform 0.5s";
      t.style.opacity = "1";
    }, i * 150);
  });
}

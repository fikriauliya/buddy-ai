interface Star {
  x: number; y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  trail: { x: number; y: number }[];
}

export function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0;
  const stars: Star[] = [];
  const shootingStars: ShootingStar[] = [];
  let mouseX = -1, mouseY = -1;
  let animFrame: number;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars.length = 0;
    const count = Math.min(200, Math.floor((w * h) / 6000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function spawnShootingStar() {
    const angle = Math.random() * 0.5 + 0.3;
    const speed = Math.random() * 6 + 4;
    shootingStars.push({
      x: Math.random() * w * 0.8,
      y: Math.random() * h * 0.3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      size: Math.random() * 2 + 1,
      trail: [],
    });
  }

  function draw(time: number) {
    ctx.clearRect(0, 0, w, h);

    // Stars
    for (const s of stars) {
      s.twinklePhase += s.twinkleSpeed;
      const flicker = 0.5 + 0.5 * Math.sin(s.twinklePhase);
      const alpha = s.opacity * flicker;

      // Mouse glow proximity
      let glow = 0;
      if (mouseX >= 0) {
        const dx = s.x - mouseX, dy = s.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) glow = (1 - dist / 150) * 0.6;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + glow)})`;
      ctx.fill();

      if (s.size > 1.5 || glow > 0.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        g.addColorStop(0, `rgba(248, 181, 0, ${(alpha + glow) * 0.3})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Drift
      s.y -= s.speed;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
    }

    // Shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 20) ss.trail.shift();
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life++;

      const alpha = 1 - ss.life / ss.maxLife;
      for (let t = 0; t < ss.trail.length; t++) {
        const ta = (t / ss.trail.length) * alpha;
        ctx.beginPath();
        ctx.arc(ss.trail[t].x, ss.trail[t].y, ss.size * (t / ss.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252, 234, 187, ${ta})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      if (ss.life >= ss.maxLife || ss.x > w + 50 || ss.y > h + 50) {
        shootingStars.splice(i, 1);
      }
    }

    // Random shooting star
    if (Math.random() < 0.005 && shootingStars.length < 3) {
      spawnShootingStar();
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createStars();
  window.addEventListener('resize', () => { resize(); createStars(); });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('mouseleave', () => { mouseX = mouseY = -1; });

  animFrame = requestAnimationFrame(draw);

  return () => cancelAnimationFrame(animFrame);
}

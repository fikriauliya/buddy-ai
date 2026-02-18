import './style.css';
import { initParticles } from './particles';

// Init particle system
const canvas = document.getElementById('starfield') as HTMLCanvasElement;
if (canvas) initParticles(canvas);

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle')!;
const navLinks = document.querySelector('.nav-links')!;
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Ramadan countdown
function updateCountdown() {
  const el = document.getElementById('ramadan-countdown');
  if (!el) return;
  // Ramadan 1447 H starts approximately Feb 28, 2026
  const ramadan = new Date('2026-02-28T00:00:00+07:00');
  const now = new Date();
  const diff = ramadan.getTime() - now.getTime();
  if (diff <= 0) {
    el.textContent = '🌙 Ramadan Mubarak!';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  el.textContent = `${days} hari ${hours} jam ${mins} menit`;
}
updateCountdown();
setInterval(updateCountdown, 60000);

// Story tabs
document.querySelectorAll<HTMLElement>('.kid-card[data-story]').forEach(card => {
  card.addEventListener('click', () => {
    const story = card.dataset.story!;
    // Toggle active
    document.querySelectorAll('.kid-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    // Toggle panels
    document.querySelectorAll('.story-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`story-${story}`);
    if (panel) {
      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll fade-in observer
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);

document.querySelectorAll('.card, .story-card, .dua-box, .message-box, .family-member, .nav-card, .kid-card, .countdown-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

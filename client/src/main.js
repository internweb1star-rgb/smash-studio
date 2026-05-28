// =====================================================
// main.js — Smash Studio entry point
// =====================================================
import './styles/main.css';
import { initDataLines } from './js/three/dataLines.js';
import { initFooterCanvas } from './js/footerCanvas.js';
import { initAnimations } from './js/animations.js';

initDataLines();
initFooterCanvas();
initAnimations();

// Smooth reveal after all initializations
const revealBody = () => {
  document.body.style.opacity = '1';
};

if (document.readyState === 'complete') {
  revealBody();
} else {
  window.addEventListener('load', revealBody);
}

// Fallback to ensure site is visible even if assets are slow
setTimeout(revealBody, 1500);
const navbar = document.getElementById("main-nav");
const triggerSection = document.getElementById("trigger-section");

window.addEventListener("scroll", () => {
  if (!triggerSection) return;
  
  const triggerTop = triggerSection.offsetTop;
  const scrollPosition = window.scrollY;

  // Hide navbar after reaching trigger section
  if (scrollPosition >= triggerTop - 100) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }
});



document.querySelectorAll('.process-step').forEach(step => {
  const circle = step.querySelector('.ripple-circle');

  step.addEventListener('mouseenter', e => {
    const rect = step.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    const scale = (Math.sqrt(dx*dx + dy*dy) * 2) / 20;

    circle.style.left = x + 'px';
    circle.style.top  = y + 'px';
    step.style.setProperty('--scale', scale);
    void circle.offsetWidth; // force reflow
    step.classList.add('hovered');
  });

  step.addEventListener('mouseleave', () => {
    step.classList.remove('hovered');
  });
});
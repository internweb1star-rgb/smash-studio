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
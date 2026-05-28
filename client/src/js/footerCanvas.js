import * as THREE from 'three';

export function initFooterCanvas() {
  const canvas = document.getElementById('footer-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false  // no antialias on footer for performance
  });

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 20;
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // Grid
  const size = 100;
  const divisions = 20; // reduced from 40
  const gridHelper = new THREE.GridHelper(size, divisions, 0x35A8F2, 0x1B4FB8);
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Floating Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x35A8F2,
    size: 0.05,
    transparent: true,
    opacity: 0.5
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  function resize() {
    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();



  // Cleanup
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    renderer.dispose();
  };
}

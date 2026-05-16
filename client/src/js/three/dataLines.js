import * as THREE from 'three';

export function initDataLines() {
  const canvas = document.getElementById('data-lines-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  // Light fog to match the light theme background
  scene.fog = new THREE.FogExp2(0xF7FAFC, 0.0015);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Data Particles / Lines
  const particleCount = 600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    // Spread them out randomly
    positions[i * 3] = (Math.random() - 0.5) * 2000; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z

    // Downward velocity
    velocities.push(Math.random() * 2 + 1);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Custom shader-like material for glowing blue tech lines
  const material = new THREE.PointsMaterial({
    color: 0x35A8F2,
    size: 2,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Group to handle slight mouse movement parallax
  const group = new THREE.Group();
  group.add(particles);
  scene.add(group);

  // Mouse Parallax Logic
  let targetX = 0;
  let targetY = 0;
  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      // Move particle down
      positions[i * 3 + 1] -= velocities[i];

      // If it goes too far down, reset it to the top
      if (positions[i * 3 + 1] < -1000) {
        positions[i * 3 + 1] = 1000;
        positions[i * 3] = (Math.random() - 0.5) * 2000; // Randomize X again
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Smooth mouse parallax
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    group.rotation.x += 0.01 * (targetY - group.rotation.x);
    group.rotation.y += 0.01 * (targetX - group.rotation.y);

    renderer.render(scene, camera);
  }

  animate();
}

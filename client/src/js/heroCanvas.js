import * as THREE from 'three';

export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const rig = new THREE.Group();
  scene.add(rig);

  scene.add(new THREE.DirectionalLight(0xffffff, 2.7)).position.set(3, 4, 5);
  scene.add(new THREE.AmbientLight(0x88c8ff, 1.6));

  const accentLight = new THREE.PointLight(0x35a8f2, 28, 12);
  accentLight.position.set(-3.5, -1.4, 3.2);
  scene.add(accentLight);

  // Floating particles only (no GLB model)
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 72;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
    positions[i * 3 + 2] = -1 - Math.random() * 3.5;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x35a8f2,
      size: 0.035,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    })
  );
  scene.add(particles);

  let pointerX = 0;
  let pointerY = 0;

  function resize() {
    const width  = canvas.clientWidth  || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function onPointerMove(event) {
    pointerX = (event.clientX / window.innerWidth  - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  const clock = new THREE.Clock();
  let rafId;

  function render() {
    rafId = requestAnimationFrame(render);
    const elapsed = clock.getElapsedTime();

    rig.rotation.y += (pointerX * 0.16 - rig.rotation.y) * 0.035;
    rig.rotation.x += (-pointerY * 0.08 - rig.rotation.x) * 0.035;
    rig.rotation.z  = Math.sin(elapsed * 0.32) * 0.045;

    particles.rotation.y = elapsed * 0.025;
    particles.rotation.x = Math.sin(elapsed * 0.18) * 0.08;

    renderer.render(scene, camera);
  }

  resize();
  render();

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Cleanup
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    renderer.dispose();
  };
}

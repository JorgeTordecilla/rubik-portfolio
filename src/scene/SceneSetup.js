import * as THREE from 'three';

export function createScene(canvas) {
  const scene = new THREE.Scene();
  // Transparent — page background shows through

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(4.5, 3.5, 5.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const w = canvas.parentElement?.clientWidth || 500;
  const h = canvas.parentElement?.clientHeight || 500;
  renderer.setSize(w, h, false);

  // ─ Lighting for sticker-style cube ──────────────────

  // Strong ambient so sticker colors read clearly
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  // Main key light (top-front-right)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(6, 10, 8);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Soft fill from the left
  const fillLight = new THREE.DirectionalLight(0xddeeff, 0.4);
  fillLight.position.set(-6, 2, 4);
  scene.add(fillLight);

  // Subtle neon rim from below-back for depth
  const rimLight = new THREE.PointLight(0x5ef5c2, 1.8, 14);
  rimLight.position.set(0, -6, -4);
  scene.add(rimLight);

  return { scene, camera, renderer };
}

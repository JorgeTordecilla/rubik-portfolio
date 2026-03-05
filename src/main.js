import './styles/main.css';
import { createScene } from './scene/SceneSetup.js';
import { RubikCube } from './cube/RubikCube.js';
import { initScrollController } from './animations/ScrollController.js';
import { renderSkills } from './sections/skills.js';
import { renderProjects } from './sections/projects.js';
import { initStats } from './sections/stats.js';
import { initMagneticButtons } from './animations/magneticButton.js';
import { initGradientMesh } from './animations/gradientMesh.js';
import { initDividerAnimation } from './animations/divider.js';

/* ─── Theme ──────────────────────────────────── */
document.documentElement.dataset.theme = 'dark';
let rubikCube;

/* ─── Custom cursor ────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let cx = -200, cy = -200;
let rx = -200, ry = -200;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    cx = e.clientX; cy = e.clientY;
    cursorDot.style.left     = cx + 'px';
    cursorDot.style.top      = cy + 'px';
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',  () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─── Mouse tilt for cube ─────────────────────────── */
let mouseNX = 0, mouseNY = 0;
let mouseTiltX = 0, mouseTiltY = 0;
window.addEventListener('mousemove', (e) => {
  mouseNX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

/* ─── Scroll tracking ───────────────────────────── */
let lastScrollTime = Date.now();
window.addEventListener('scroll', () => { lastScrollTime = Date.now(); }, { passive: true });

/* ─── Section nav observer ─────────────────────────── */
const snavItems = document.querySelectorAll('#section-nav .snav-item');
if (snavItems.length) {
  const sectionObs = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        snavItems.forEach(item =>
          item.classList.toggle('active', item.dataset.section === id)
        );
      }
    }),
    { threshold: 0.45 }
  );
  document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));
}

/* ─── Loader ──────────────────────────────────── */
const loader     = document.getElementById('loader');
const loaderFill = document.querySelector('.loader-fill');
let   loadProgress = 0;
const fakeLoad = setInterval(() => {
  loadProgress += 12;
  loaderFill.style.width = Math.min(loadProgress, 100) + '%';
  if (loadProgress >= 100) {
    clearInterval(fakeLoad);
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => loader.style.display = 'none', 600);
    }, 200);
  }
}, 80);

/* ─── Three.js scene ────────────────────────────── */
const canvas = document.getElementById('rubik-canvas');
const { scene, camera, renderer } = createScene(canvas);

function resizeRenderer() {
  const wrap = canvas.parentElement;
  if (!wrap) return;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
requestAnimationFrame(resizeRenderer);
window.addEventListener('resize', resizeRenderer, { passive: true });

/* ─── Cube ────────────────────────────────────── */
rubikCube = new RubikCube(scene);
rubikCube.setTheme('dark');

/* ─── Sections ──────────────────────────────────── */
renderSkills();
renderProjects();
initStats();
initMagneticButtons();
initGradientMesh();
initDividerAnimation();

/* ─── Scroll → solve cube ─────────────────────────── */
initScrollController(rubikCube);

/* ─── Contact: cube glow + hide float pill ──────────────── */
const contactEl    = document.getElementById('contact');
const contactFloat = document.getElementById('contact-float');
if (contactEl) {
  new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible) {
      setTimeout(() => document.body.classList.add('cube-solved'), 800);
      if (contactFloat) contactFloat.classList.add('contact-float--hidden');
    } else {
      document.body.classList.remove('cube-solved');
      if (contactFloat) contactFloat.classList.remove('contact-float--hidden');
    }
  }, { threshold: 0.3 }).observe(contactEl);
}

/* ─── Scroll reveal ─────────────────────────────── */
const ro = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach(el => ro.observe(el));

/* ─── Animate loop ──────────────────────────────── */
const IDLE_DELAY = 1800;
let idleVelocity = 0;
let sceneRotY    = 0;

function animate() {
  requestAnimationFrame(animate);

  if (cursorRing) {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  }

  mouseTiltX += (mouseNY * 0.15 - mouseTiltX) * 0.05;
  mouseTiltY += (mouseNX * 0.22 - mouseTiltY) * 0.05;

  const idle = (Date.now() - lastScrollTime) > IDLE_DELAY && !rubikCube.isAnimating;
  idleVelocity += ((idle ? 0.005 : 0) - idleVelocity) * 0.022;

  sceneRotY       += idleVelocity;
  scene.rotation.y = sceneRotY + mouseTiltY;
  scene.rotation.x = Math.sin(sceneRotY * 0.35) * 0.08 + mouseTiltX;

  renderer.render(scene, camera);
}
animate();

// src/animations/divider.js
// Animates the section divider lines so they open in the center
// when the Rubik's cube is near, creating a "parting" effect.
// Uses lerp each RAF frame for smooth inercia.

const LERP    = 0.12; // smoothing factor — higher = snappier
const MAX_GAP = 20;   // max half-width of gap in vw-% (total gap = 2x this)

export function initDividerAnimation() {
  const sections = Array.from(document.querySelectorAll('section:not(#hero)'));
  const cubeBg   = document.getElementById('cube-bg');

  if (!sections.length) return;

  // Animated state per section
  const state = sections.map(() => ({ cur: 0 }));

  // The zone around the line where the animation starts (px)
  function influenceRadius() {
    return cubeBg ? cubeBg.offsetHeight * 0.75 : window.innerHeight * 0.5;
  }

  // Smooth ease-in-out curve (0 → 1)
  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function tick() {
    // Cube is position:fixed at 50vh — its vertical center is always here
    const cubeY  = window.innerHeight / 2;
    const radius = influenceRadius();

    sections.forEach((section, i) => {
      // The divider line sits at the very top of each section
      const lineY = section.getBoundingClientRect().top;
      const dist  = Math.abs(lineY - cubeY);

      // Target gap: 0 when far, MAX_GAP when cube center is at the line
      const t         = dist < radius ? smoothstep(1 - dist / radius) : 0;
      const targetGap = MAX_GAP * t;

      // Lerp toward target for inercia feel
      state[i].cur += (targetGap - state[i].cur) * LERP;

      section.style.setProperty('--divider-gap', state[i].cur.toFixed(2) + '%');
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

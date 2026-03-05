// src/animations/divider.js
// Animates section divider lines, opening a gap as the cube approaches.
// Gap size is computed from the cube's actual rendered width so it
// works correctly on both desktop and mobile.

const LERP = 0.12; // smoothing / inercia

export function initDividerAnimation() {
  const sections = Array.from(document.querySelectorAll('section:not(#hero)'));
  const cubeBg   = document.getElementById('cube-bg');

  if (!sections.length) return;

  const state = sections.map(() => ({ cur: 0 }));

  // Vertical zone (px) around the line where the animation activates
  function influenceRadius() {
    return cubeBg ? cubeBg.offsetHeight * 0.75 : window.innerHeight * 0.5;
  }

  // Half-gap needed to clear the cube, as % of viewport width.
  // Reads the cube's actual rendered width so it adapts to any screen size.
  function maxGap() {
    if (!cubeBg) return 22;
    const halfCubeVw = (cubeBg.offsetWidth / 2 / window.innerWidth) * 100;
    // Add 5% buffer so the cube has room to breathe
    return Math.min(halfCubeVw + 5, 44);
  }

  // Smooth ease-in-out curve (0 → 1)
  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function tick() {
    const cubeY  = window.innerHeight / 2;
    const radius = influenceRadius();
    const gap    = maxGap();

    sections.forEach((section, i) => {
      const lineY = section.getBoundingClientRect().top;
      const dist  = Math.abs(lineY - cubeY);

      const t         = dist < radius ? smoothstep(1 - dist / radius) : 0;
      const targetGap = gap * t;

      state[i].cur += (targetGap - state[i].cur) * LERP;

      section.style.setProperty('--divider-gap', state[i].cur.toFixed(2) + '%');
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTION_SEQUENCE } from '../cube/scramble.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollController(rubikCube) {
  let totalMoveIndex = 0;
  let lastProgress    = 0;
  let lastTime        = performance.now();

  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      // ── Measure scroll velocity (progress units / second) ─────
      const now = performance.now();
      const dt  = Math.max(16, now - lastTime);
      const dp  = Math.abs(self.progress - lastProgress);
      const velocity = dp / dt * 1000;  // progress/sec

      lastTime     = now;
      lastProgress = self.progress;

      // ── Map velocity → animation duration ────────────────
      // velocity ≈ 0    → 0.45 s  (lento, deliberado)
      // velocity ≈ 0.5  → 0.27 s  (scroll normal)
      // velocity ≈ 1.5  → 0.15 s  (scroll rápido)
      // velocity ≥ 2    → 0.12 s  (mínimo — nunca menos)
      const duration = Math.max(0.12, 0.45 / (1 + velocity * 1.6));

      // ── Resolve target move index from scroll progress ─────
      const targetIndex = Math.floor(self.progress * SOLUTION_SEQUENCE.length);
      const diff        = targetIndex - totalMoveIndex;

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          const move = SOLUTION_SEQUENCE[totalMoveIndex + i];
          if (move) rubikCube.enqueueMove(move, duration);
        }
        totalMoveIndex += diff;
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          const move = SOLUTION_SEQUENCE[totalMoveIndex - 1 - i];
          if (move) rubikCube.enqueueMove(invertMove(move), duration);
        }
        totalMoveIndex += diff;
      }

      if (self.progress >= 0.98 && totalMoveIndex >= SOLUTION_SEQUENCE.length - 1) {
        rubikCube.celebrationAnimation();
      }
    }
  });

  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

function invertMove(move) {
  if (move.endsWith("'")) return move.slice(0, -1);
  if (move.endsWith('2')) return move;
  return move + "'";
}

/**
 * Animated gradient mesh that follows the mouse.
 * Two soft radial gradients: accent teal + deep purple.
 */
export function initGradientMesh() {
  const bg = document.getElementById('gradient-bg');
  if (!bg) return;

  let mx = 0.35, my = 0.42;
  let tx = 0.35, ty = 0.42;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX / window.innerWidth;
    ty = e.clientY / window.innerHeight;
  }, { passive: true });

  function tick() {
    mx += (tx - mx) * 0.028;
    my += (ty - my) * 0.028;

    const x1 = (mx * 75 + 12).toFixed(2);
    const y1 = (my * 75 + 12).toFixed(2);
    const x2 = (95 - mx * 70).toFixed(2);
    const y2 = (95 - my * 65).toFixed(2);

    bg.style.background = [
      `radial-gradient(ellipse 68% 58% at ${x1}% ${y1}%, rgba(94,245,194,0.13) 0%, transparent 62%)`,
      `radial-gradient(ellipse 58% 48% at ${x2}% ${y2}%, rgba(110,45,210,0.11) 0%, transparent 62%)`,
      `radial-gradient(ellipse 38% 32% at 50% 50%, rgba(20,55,130,0.06) 0%, transparent 55%)`
    ].join(', ');

    requestAnimationFrame(tick);
  }
  tick();
}

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { rotateLayer } from './LayerRotation.js';
import { SCRAMBLE_SEQUENCE } from './scramble.js';

// ─ Neon palette — dark mode ───────────────────────────
const DARK_COLORS = {
  right:  '#ff2d78',
  left:   '#ff8800',
  top:    '#00f0ff',
  bottom: '#f5f500',
  front:  '#39ff14',
  back:   '#c026ff',
};

// ─ Jewel tone palette — light mode ─────────────────────
const LIGHT_COLORS = {
  right:  '#d4321c',   // rojo vivo
  left:   '#e07010',   // naranja intenso
  top:    '#0fa8b8',   // teal brillante
  bottom: '#d4a800',   // amarillo dorado
  front:  '#22a04a',   // verde intenso
  back:   '#7c22cc',   // violeta saturado
};

// ─ Texture cache (split per tema) ────────────────────
const _cache = { dark: {}, light: {} };

function makeStickerTexture(color, theme = 'dark') {
  const bucket = _cache[theme] || (_cache[theme] = {});
  if (bucket[color]) return bucket[color];

  const S = 512;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d');

  // Base plástico:
  // dark → negro oscuro para que el cubo resalte
  // light → marrón oscuro cálido — contrasta con el fondo crema
  const base = theme === 'light' ? '#1a1208' : '#0d0d0d';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  const pad = 36, r = 72;
  const x = pad, y = pad, w = S - pad * 2, h = S - pad * 2;

  const grad = ctx.createRadialGradient(S/2, S/2, S*0.08, S/2, S/2, S*0.52);
  grad.addColorStop(0, color + 'ff');
  grad.addColorStop(1, color + 'dd');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  bucket[color] = tex;
  return tex;
}

function stickerMat(color, theme = 'dark') {
  if (!color) {
    // Base plástico sin sticker
    const baseHex = theme === 'light' ? 0x1a1208 : 0x111111;
    return new THREE.MeshStandardMaterial({ color: baseHex, roughness: 0.80, metalness: 0.0 });
  }
  return new THREE.MeshStandardMaterial({
    map: makeStickerTexture(color, theme),
    roughness: theme === 'light' ? 0.35 : 0.28,
    metalness: 0.02,
  });
}

export class RubikCube {
  constructor(scene) {
    this.scene = scene;
    this.cubies = [];
    this._cubieGrid = [];
    this.isAnimating = false;
    this.moveQueue = [];
    this._build();
    this._applyScramble();
  }

  _build() {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          this._cubieGrid.push({ x, y, z });
          const cubie = this._createCubie(x, y, z, 'dark');
          cubie.position.set(x, y, z);
          this.scene.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  _createCubie(x, y, z, theme = 'dark') {
    const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
    const geo = new RoundedBoxGeometry(0.97, 0.97, 0.97, 4, 0.055);
    return new THREE.Mesh(geo, [
      stickerMat(x === 1  ? colors.right  : null, theme),
      stickerMat(x === -1 ? colors.left   : null, theme),
      stickerMat(y === 1  ? colors.top    : null, theme),
      stickerMat(y === -1 ? colors.bottom : null, theme),
      stickerMat(z === 1  ? colors.front  : null, theme),
      stickerMat(z === -1 ? colors.back   : null, theme),
    ]);
  }

  setTheme(theme) {
    const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
    this._cubieGrid.forEach(({ x, y, z }, i) => {
      this.cubies[i].material = [
        stickerMat(x === 1  ? colors.right  : null, theme),
        stickerMat(x === -1 ? colors.left   : null, theme),
        stickerMat(y === 1  ? colors.top    : null, theme),
        stickerMat(y === -1 ? colors.bottom : null, theme),
        stickerMat(z === 1  ? colors.front  : null, theme),
        stickerMat(z === -1 ? colors.back   : null, theme),
      ];
    });
  }

  _applyScramble() {
    SCRAMBLE_SEQUENCE.forEach(move => rotateLayer(this.cubies, this.scene, move, 0));
  }

  async executeMove(move, duration = 0.45) {
    this.isAnimating = true;
    await rotateLayer(this.cubies, this.scene, move, duration);
    this.isAnimating = false;
    this._processQueue();
  }

  enqueueMove(move, duration = 0.45) {
    this.moveQueue.push({ move, duration });
    if (!this.isAnimating) this._processQueue();
  }

  _processQueue() {
    if (this.moveQueue.length === 0) return;
    const { move, duration } = this.moveQueue.shift();
    this.executeMove(move, duration);
  }

  celebrationAnimation() {
    gsap.to(this.cubies.map(c => c.scale), {
      x: 1.1, y: 1.1, z: 1.1, duration: 0.3,
      ease: 'power2.out', yoyo: true, repeat: 3, stagger: 0.02,
    });
  }
}

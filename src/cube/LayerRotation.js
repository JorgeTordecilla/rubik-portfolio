import * as THREE from 'three';
import { gsap } from 'gsap';

const MOVE_MAP = {
  'U':  { axis: new THREE.Vector3(0,1,0),  layerY:  1, dir: -1 },
  "U'": { axis: new THREE.Vector3(0,1,0),  layerY:  1, dir:  1 },
  'D':  { axis: new THREE.Vector3(0,1,0),  layerY: -1, dir:  1 },
  "D'": { axis: new THREE.Vector3(0,1,0),  layerY: -1, dir: -1 },
  'R':  { axis: new THREE.Vector3(1,0,0),  layerX:  1, dir: -1 },
  "R'": { axis: new THREE.Vector3(1,0,0),  layerX:  1, dir:  1 },
  'L':  { axis: new THREE.Vector3(1,0,0),  layerX: -1, dir:  1 },
  "L'": { axis: new THREE.Vector3(1,0,0),  layerX: -1, dir: -1 },
  'F':  { axis: new THREE.Vector3(0,0,1),  layerZ:  1, dir: -1 },
  "F'": { axis: new THREE.Vector3(0,0,1),  layerZ:  1, dir:  1 },
  'B':  { axis: new THREE.Vector3(0,0,1),  layerZ: -1, dir:  1 },
  "B'": { axis: new THREE.Vector3(0,0,1),  layerZ: -1, dir: -1 },
  'U2': { axis: new THREE.Vector3(0,1,0),  layerY:  1, dir: -2 },
  'D2': { axis: new THREE.Vector3(0,1,0),  layerY: -1, dir:  2 },
  'R2': { axis: new THREE.Vector3(1,0,0),  layerX:  1, dir: -2 },
  'L2': { axis: new THREE.Vector3(1,0,0),  layerX: -1, dir:  2 },
  'F2': { axis: new THREE.Vector3(0,0,1),  layerZ:  1, dir: -2 },
  'B2': { axis: new THREE.Vector3(0,0,1),  layerZ: -1, dir:  2 },
};

export function rotateLayer(cubies, scene, move, duration = 0.4) {
  return new Promise(resolve => {
    const config = MOVE_MAP[move];
    if (!config) { resolve(); return; }

    const EPS = 0.85;
    const layerCubies = cubies.filter(c => {
      if (config.layerX !== undefined) return Math.abs(c.position.x - config.layerX) < EPS;
      if (config.layerY !== undefined) return Math.abs(c.position.y - config.layerY) < EPS;
      if (config.layerZ !== undefined) return Math.abs(c.position.z - config.layerZ) < EPS;
      return false;
    });

    const pivot = new THREE.Group();
    scene.add(pivot);
    layerCubies.forEach(c => pivot.attach(c));

    const turns = Math.abs(config.dir);
    const sign = config.dir > 0 ? 1 : -1;
    const angle = (Math.PI / 2) * sign * turns;
    const targetRotation = {};
    if (config.layerX !== undefined) targetRotation.x = angle;
    if (config.layerY !== undefined) targetRotation.y = angle;
    if (config.layerZ !== undefined) targetRotation.z = angle;

    if (duration === 0) {
      pivot.rotation.set(
        targetRotation.x || 0,
        targetRotation.y || 0,
        targetRotation.z || 0
      );
      layerCubies.forEach(c => {
        scene.attach(c);
        c.position.x = Math.round(c.position.x);
        c.position.y = Math.round(c.position.y);
        c.position.z = Math.round(c.position.z);
      });
      scene.remove(pivot);
      resolve();
      return;
    }

    gsap.to(pivot.rotation, {
      ...targetRotation,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        layerCubies.forEach(c => {
          scene.attach(c);
          c.position.x = Math.round(c.position.x);
          c.position.y = Math.round(c.position.y);
          c.position.z = Math.round(c.position.z);
        });
        scene.remove(pivot);
        resolve();
      }
    });
  });
}

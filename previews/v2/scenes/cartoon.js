import { THREE, setup, keyLight, render, clay, glossy, metal, glow, sphere, cyl, capsule, torus, mesh, group } from '/v2/lib.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const ctx = setup({ bg: '#6fd0ff', fov: 30, exposure: 0.95, envIntensity: 0.6 });
const { scene, camera } = ctx;
// sky gradient
const c = document.createElement('canvas'); c.width = 4; c.height = 512; const x = c.getContext('2d');
const gr = x.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#3fb4ff'); gr.addColorStop(0.7, '#9fe2ff'); gr.addColorStop(1, '#e6f8ff');
x.fillStyle = gr; x.fillRect(0, 0, 4, 512);
const sky = new THREE.CanvasTexture(c); sky.colorSpace = THREE.SRGBColorSpace; scene.background = sky;
camera.position.set(0, 4.5, 30); camera.lookAt(0, 4.6, 0);

// hill + grass + flowers
const hill = sphere(30, clay('#46c96f', { roughness: 0.75, sheen: 1, sheenColor: new THREE.Color('#b8ffb0') }), { pos: [0, -29.2, -4] });
scene.add(hill);
const hill2 = sphere(26, clay('#36b45e', { roughness: 0.8 }), { pos: [-14, -23, -22] }); scene.add(hill2);
for (let i = 0; i < 26; i++) {
  const a = -1.2 + (i / 26) * 2.4, r = 30.05;
  const px = Math.sin(a * 0.35) * r, py = -29.2 + Math.cos(a * 0.35) * r, pz = -4 + ((i * 7) % 5) * 1.2 - 1;
  const fc = ['#ffffff', '#ffd23f', '#ff5a8a', '#ffffff'][i % 4];
  const f = group(cyl(0.03, 0.03, 0.5, clay('#2a9a4a'), { pos: [0, 0.25, 0] }), sphere(0.18, clay(fc), { pos: [0, 0.55, 0] }), sphere(0.08, clay('#ffb020'), { pos: [0, 0.6, 0.12] }));
  f.position.set(px * 1.0 + (i % 3) * 0.3, py, pz + 3); scene.add(f);
}
// clouds
const cloudM = clay('#ffffff', { roughness: 0.9, clearcoat: 0 });
for (const [cx, cy, cz, s] of [[-4, 11, -10, 1.2], [5, 13, -14, 1.5], [3, 8.5, -6, 0.8]]) {
  const cl = group(); [[0, 0, 0, 1], [1, 0.3, 0, 0.8], [-1, 0.1, 0, 0.75], [0.4, 0.6, 0, 0.7]].forEach(([a, b, d, r]) => cl.add(sphere(r, cloudM, { pos: [a, b, d], shadow: false })));
  cl.position.set(cx, cy, cz); cl.scale.setScalar(s); scene.add(cl);
}

// coin mascot
const gold = metal('#ffc53d', { roughness: 0.22 });
const goldInner = metal('#ffd45e', { roughness: 0.3 });
const coin = new THREE.Group();
const prof = []; const R = 1.9, T = 0.55;
prof.push(new THREE.Vector2(0, -T)); prof.push(new THREE.Vector2(R - 0.12, -T)); prof.push(new THREE.Vector2(R, -T + 0.12)); prof.push(new THREE.Vector2(R, T - 0.12)); prof.push(new THREE.Vector2(R - 0.12, T)); prof.push(new THREE.Vector2(0, T));
const body = mesh(new THREE.LatheGeometry(prof, 96), gold, { rot: [Math.PI / 2, 0, 0] });
coin.add(body);
coin.add(mesh(new THREE.CylinderGeometry(R - 0.32, R - 0.32, 0.1, 96), goldInner, { pos: [0, 0, T - 0.02], rot: [Math.PI / 2, 0, 0] }));
coin.add(torus(R - 0.3, 0.06, gold, { pos: [0, 0, T + 0.02] }));
// ridges on the rim
for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; coin.add(mesh(new THREE.BoxGeometry(0.07, 0.09, 0.82), metal('#e8a820'), { pos: [Math.cos(a) * (R + 0.01), Math.sin(a) * (R + 0.01), 0], rot: [0, 0, a], shadow: false })); }
// face (shocked)
const white = glossy('#ffffff'), ink = glossy('#1d1d1d');
for (const sx of [-1, 1]) {
  coin.add(sphere(0.45, white, { pos: [sx * 0.62, 0.32, T + 0.05], scale: [1, 1.15, 0.45] }));
  coin.add(sphere(0.2, ink, { pos: [sx * 0.6, 0.42, T + 0.25], scale: [1, 1, 0.4] }));
  coin.add(sphere(0.07, glow('#ffffff', 2), { pos: [sx * 0.6 + 0.08, 0.52, T + 0.33] }));
  coin.add(capsule(0.06, 0.32, ink, { pos: [sx * 0.62, 1.0, T + 0.1], rot: [0, 0, Math.PI / 2 - sx * 0.35] }));
}
coin.add(sphere(0.32, clay('#4a1414'), { pos: [0, -0.62, T + 0.05], scale: [0.9, 1.15, 0.35] }));
coin.add(sphere(0.14, clay('#ff6a6a'), { pos: [0, -0.8, T + 0.14], scale: [1.4, 0.6, 0.3] }));
// limbs
const limb = clay('#1d1d1d', { roughness: 0.4, clearcoat: 0.6 });
for (const sx of [-1, 1]) {
  coin.add(capsule(0.1, 1.0, limb, { pos: [sx * 2.35, 0.75, 0], rot: [0, 0, sx * 0.75] }));
  coin.add(sphere(0.3, glossy('#ffffff'), { pos: [sx * 2.75, 1.25, 0] }));
  coin.add(capsule(0.11, 0.9, limb, { pos: [sx * 0.6, -2.35, 0], rot: [0, 0, sx * 0.1] }));
  coin.add(sphere(0.3, glossy('#1d1d1d'), { pos: [sx * 0.7, -2.85, 0.15], scale: [1.3, 0.6, 1.6] }));
}
coin.position.set(0, 3.9, 1); coin.rotation.set(0.05, -0.12, 0.06);
scene.add(coin);

// 3D number
const font = await new Promise((r) => new FontLoader().load('/v2/node_modules/three/examples/fonts/helvetiker_bold.typeface.json', r));
const tg = new TextGeometry('$21,725', { font, size: 1.6, depth: 0.55, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.06, bevelSegments: 6 });
tg.center();
const num = mesh(tg, glossy('#1fae4f', { roughness: 0.3 }), { pos: [0, 9.5, -1], rot: [0.08, 0, 0] });
scene.add(num);

keyLight(scene, { intensity: 3.0, color: '#fff6e6', pos: [6, 14, 12], target: [0, 3, 0], size: 9, radius: 8 });
scene.add(new THREE.HemisphereLight('#bfe8ff', '#4ab86a', 0.9));

document.getElementById('ui').innerHTML = `
<style>
.stamp{position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center}
.stamp div{transform:rotate(-6deg);background:linear-gradient(#ff7064,#e8443a);color:#fff;font:700 76px Fredoka;padding:6px 40px 12px;border-radius:26px;box-shadow:0 14px 0 #a82a22,0 30px 50px rgba(0,0,0,.25);letter-spacing:1px}
.cap{position:absolute;left:0;right:0;bottom:300px;text-align:center;font:700 96px Fredoka;color:#ff5a4e;-webkit-text-stroke:14px #1d1d1d;paint-order:stroke fill;text-shadow:0 8px 0 #1d1d1d}
</style>
<div class="stamp"><div>40 YEARS</div></div>
<div class="cap">How?</div>`;
await render(ctx, { bloom: [0.12, 0.4, 0.97], vignette: 0.18, grain: 0.02 });

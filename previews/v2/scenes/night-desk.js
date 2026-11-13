import { THREE, setup, keyLight, render, character, clay, fabric, glossy, metal, glow, wood, box, sphere, cyl, capsule, torus, mesh, group, rng } from '/v2/lib.js';

const ctx = setup({ bg: '#0b0f1e', fov: 30, exposure: 1.1, envIntensity: 0.12 });
const { scene, camera } = ctx;
camera.position.set(0, 6, 28); camera.lookAt(0, 4.6, 0);
const R = rng(7);

scene.add(mesh(new THREE.PlaneGeometry(40, 30), clay('#1c2240', { roughness: 0.9 }), { pos: [0, 8, -5] }));
// window: frame, city outside, rain
const winX = -1.6, winY = 8.6;
for (const [w, h, x, y] of [[6.2, 0.35, 0, 3.1], [6.2, 0.35, 0, -3.1], [0.35, 6.5, -3.1, 0], [0.35, 6.5, 3.1, 0], [0.2, 6.2, 0, 0], [6.0, 0.2, 0, 0.6]])
  scene.add(box(w, h, 0.5, 0.06, clay('#2a3054'), { pos: [winX + x, winY + y, -4.6] }));
scene.add(box(6.8, 0.3, 1.0, 0.06, clay('#2a3054'), { pos: [winX, winY - 3.35, -4.3] }));
const city = group();
for (let i = 0; i < 26; i++) {
  const w = 0.8 + R() * 1.4, h = 3 + R() * 9, x = -16 + i * 1.3, z = -14 - R() * 10;
  city.add(box(w, h, w, 0.02, clay('#0e1630', { roughness: 0.9 }), { pos: [x, h / 2 - 1, z], shadow: false }));
  for (let k = 0; k < 10; k++) if (R() < 0.5) city.add(mesh(new THREE.PlaneGeometry(0.18, 0.24), glow(R() < 0.8 ? '#ffcf7a' : '#7fd6ff', 2.5), { pos: [x - w / 2 + 0.2 + R() * (w - 0.4), R() * (h - 1), z + w / 2 + 0.01], shadow: false }));
}
scene.add(city);
scene.add(mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshBasicMaterial({ color: '#16224a' }), { pos: [0, 10, -26], shadow: false }));
const rainM = new THREE.MeshBasicMaterial({ color: '#a8c4ff', transparent: true, opacity: 0.35 });
for (let i = 0; i < 160; i++) {
  const d = mesh(new THREE.BoxGeometry(0.018, 0.5 + R() * 0.6, 0.01), rainM, { pos: [winX - 3 + R() * 6, winY - 3 + R() * 6, -4.75 - R() * 3], rot: [0, 0, 0.18], shadow: false });
  scene.add(d);
}
for (let i = 0; i < 14; i++) scene.add(sphere(0.05, glossy('#cfe0ff', { transparent: true, opacity: 0.7 }), { pos: [winX - 2.8 + R() * 5.6, winY - 2.8 + R() * 5.6, -4.4], scale: [1, 1.4, 0.4], shadow: false }));
const moon = new THREE.PointLight('#6f8cff', 30, 20, 1.2); moon.position.set(winX, winY, -6); scene.add(moon);

// desk
scene.add(box(10, 0.35, 4, 0.1, wood('#3a2c3a', '#241a24', 512, 512, 0.5), { pos: [0, 2.6, 0.4] }));
scene.add(mesh(new THREE.PlaneGeometry(40, 40), clay('#141628'), { rot: [-Math.PI / 2, 0, 0] }));
// character (back three-quarter) in hoodie
const ch = character({ skin: '#e2b08a', shirt: '#4a5a8a', hair: '#2a1e1a', hairStyle: 'hood', expression: 'flat', look: [0.6, -0.4] });
ch.position.set(-2.0, 2.3, 1.2); ch.rotation.y = Math.PI / 2 - 0.75; scene.add(ch);
ch.userData.head.children.forEach((m) => { if (m.material && m.material.color && m.material.color.getHexString() === '2a1e1a') m.material = fabric('#4a5a8a'); });
// laptop with glowing screen facing character
const lap = group(box(2.6, 0.12, 1.8, 0.05, metal('#5a5f6a', { roughness: 0.35 })), box(2.6, 1.7, 0.1, 0.05, metal('#5a5f6a', { roughness: 0.35 }), { pos: [0, 0.85, -0.9], rot: [-0.25, 0, 0] }));
lap.add(mesh(new THREE.PlaneGeometry(2.35, 1.45), glow('#9fe8ff', 0.75), { pos: [0, 0.87, -0.84], rot: [-0.25, 0, 0], shadow: false }));
lap.position.set(0.6, 2.84, 0.6); lap.rotation.y = -Math.PI / 2 + 0.35; scene.add(lap);
const screenL = new THREE.PointLight('#8fe0ff', 10, 6, 1.5); screenL.position.set(-0.4, 4.0, 0.9); scene.add(screenL);
// lamp
scene.add(cyl(0.55, 0.6, 0.14, metal('#2a2440'), { pos: [3.6, 2.85, -0.4] }));
scene.add(capsule(0.06, 2.6, metal('#2a2440'), { pos: [3.5, 4.2, -0.4], rot: [0, 0, 0.2] }));
scene.add(capsule(0.06, 1.6, metal('#2a2440'), { pos: [2.9, 5.6, -0.4], rot: [0, 0, 1.0] }));
scene.add(mesh(new THREE.ConeGeometry(0.7, 0.9, 48, 1, true), clay('#e8a85a', { side: THREE.DoubleSide }), { pos: [2.1, 5.7, -0.3], rot: [0, 0, 0.6] }));
scene.add(sphere(0.25, glow('#ffd59a', 6), { pos: [1.85, 5.4, -0.3] }));
const lampL = new THREE.SpotLight('#ffb866', 160, 14, 0.75, 0.6, 1.4); lampL.position.set(1.9, 5.5, -0.3); lampL.target.position.set(0.4, 2.6, 0.6); lampL.castShadow = true; lampL.shadow.mapSize.set(2048, 2048); lampL.shadow.radius = 6; scene.add(lampL, lampL.target);
// mug + books
scene.add(cyl(0.34, 0.3, 0.7, glossy('#e8e0d0'), { pos: [2.6, 3.12, 1.2] }));
scene.add(box(1.6, 0.3, 1.1, 0.04, clay('#7a4a6a'), { pos: [-3.6, 2.93, 0.4], rot: [0, 0.2, 0] }));
scene.add(box(1.5, 0.28, 1.0, 0.04, clay('#3a6a7a'), { pos: [-3.6, 3.22, 0.4], rot: [0, -0.1, 0] }));
// helper robot
const bot = group(
  box(1.5, 1.2, 1.2, 0.4, glossy('#c8d6ea', { roughness: 0.25 })),
  box(1.15, 0.65, 0.2, 0.25, glossy('#141a33'), { pos: [0, 0.02, 0.55] }),
  sphere(0.13, glow('#7ff0ff', 2.2), { pos: [-0.25, 0.05, 0.66] }), sphere(0.13, glow('#7ff0ff', 2.2), { pos: [0.25, 0.05, 0.66] }),
  cyl(0.03, 0.03, 0.5, metal('#9ab'), { pos: [0, 0.85, 0] }), sphere(0.12, glow('#ffbe6e', 5), { pos: [0, 1.15, 0] }),
  cyl(0.4, 0.15, 0.4, glossy('#d8e4f4'), { pos: [0, -0.8, 0] }),
);
bot.position.set(2.4, 8.1, 1.4); bot.rotation.set(0.1, -0.5, 0.08); scene.add(bot);
const botL = new THREE.PointLight('#7ff0ff', 6, 6, 1.5); botL.position.set(2.4, 8.1, 2.4); scene.add(botL);
const sp = glow('#ffe6b0', 5); [[1.2, 9.0], [3.6, 8.6], [3.2, 9.4], [1.5, 7.4]].forEach(([x, y]) => scene.add(mesh(new THREE.OctahedronGeometry(0.1), sp, { pos: [x, y, 1.6], shadow: false })));

scene.add(new THREE.HemisphereLight('#3a4a8a', '#0a0a14', 0.4));

document.getElementById('ui').innerHTML = `
<style>
.step{position:absolute;right:56px;width:430px;padding:22px 26px;border-radius:26px;color:#fff2df;font:700 32px Inter;display:flex;gap:18px;align-items:center}
.step b{flex:none;width:56px;height:56px;border-radius:50%;background:linear-gradient(150deg,#ffd08a,#ff9e4a);color:#1a1530;display:flex;align-items:center;justify-content:center;font:900 30px Inter;box-shadow:0 0 24px rgba(255,190,110,.6)}
.cap{position:absolute;left:0;right:0;bottom:300px;text-align:center;font:800 68px Inter;color:#fff2df;text-shadow:0 6px 30px rgba(0,0,0,.8)}
</style>
<div class="step glass" style="top:290px;opacity:.5;transform:scale(.9);transform-origin:right"><b>1</b>Clear the cache</div>
<div class="step glass" style="top:410px"><b>2</b>Restart the dev server</div>
<div class="cap">Restart the <span style="color:#ffbe6e">server.</span></div>`;
await render(ctx, { bloom: [0.5, 0.55, 0.78], vignette: 0.5, dof: null, grain: 0.04 });

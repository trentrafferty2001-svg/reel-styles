import { THREE, setup, keyLight, render, character, clay, fabric, glossy, metal, glow, wood, box, sphere, cyl, capsule, torus, mesh, group } from '/v2/lib.js';

const ctx = setup({ bg: '#2a1c12', fov: 30, exposure: 0.82, envIntensity: 0.35, fog: new THREE.Fog('#3a2618', 40, 80) });
const { scene, camera } = ctx;
camera.position.set(0, 6.5, 32);
camera.lookAt(0, 5.6, 0);

const W1 = wood('#7a4a28', '#4a2a14'), W2 = wood('#5e3820', '#3a200e'), W3 = wood('#8a5a32', '#5a3519');
// back wall: wainscot + cream plaster + tall windows
scene.add(mesh(new THREE.PlaneGeometry(40, 30), clay('#cdb894', { roughness: 0.95 }), { pos: [0, 8, -8] }));
for (let i = -6; i <= 6; i++) scene.add(box(1.5, 6, 0.4, 0.05, i % 2 ? W1 : W2, { pos: [i * 1.55, 0.5, -7.7] }));
scene.add(box(22, 0.4, 0.7, 0.08, W3, { pos: [0, 3.6, -7.5] }));
for (const x of [-6.2, 6.2]) {
  scene.add(box(2.2, 6, 0.3, 0.1, W2, { pos: [x, 8.5, -7.8] }));
  scene.add(mesh(new THREE.PlaneGeometry(1.8, 5.6), glow('#fff1d0', 2.2), { pos: [x, 8.5, -7.6], shadow: false }));
}
// light shafts
for (const x of [-6.2, 6.2]) {
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 3.2, 16, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe2a8', transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  sh.position.set(x * 0.6, 4, -2); sh.rotation.set(0.75, 0, -x * 0.05); scene.add(sh);
}
// seal
const seal = group(cyl(1.5, 1.5, 0.25, metal('#c9a24a', { roughness: 0.35 })), torus(1.25, 0.06, metal('#8a6a2a')), torus(1.5, 0.08, metal('#a8842e')));
seal.rotation.x = Math.PI / 2; seal.position.set(0, 9.0, -7.4);
const scale = group(cyl(0.05, 0.05, 1.3, metal('#5a4214')), box(1.6, 0.08, 0.08, 0.03, metal('#5a4214'), { pos: [0, 0.6, 0] }), cyl(0.35, 0.25, 0.12, metal('#5a4214'), { pos: [-0.75, 0.15, 0] }), cyl(0.35, 0.25, 0.12, metal('#5a4214'), { pos: [0.75, 0.15, 0] }));
scale.position.set(0, 8.9, -7.15); scene.add(seal);
const star = mesh(new THREE.ExtrudeGeometry((() => { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.32 : 0.8, a = (i / 10) * Math.PI * 2 + Math.PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return s; })(), { depth: 0.15, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 }), metal('#8a6a2a'), { pos: [0, 9.0, -7.2] });
scene.add(star);

// judge + bench
const judge = character({ skin: '#eab896', hair: '#d8d8d8', hairStyle: 'grey', robe: true, glasses: true, expression: 'flat', brows: -1, look: [0, -0.3] });
judge.position.set(0, 2.9, -4.4); scene.add(judge);
scene.add(box(7.5, 4.6, 2.2, 0.15, W1, { pos: [0, 2.2, -3] }));
scene.add(box(7.9, 0.3, 2.6, 0.1, W3, { pos: [0, 4.6, -3] }));
for (const x of [-2.6, 0, 2.6]) scene.add(box(2.1, 3.2, 0.12, 0.08, W2, { pos: [x, 2.0, -1.85] }));
scene.add(box(2.2, 0.55, 0.1, 0.06, metal('#c9a24a'), { pos: [0, 3.95, -1.75] }));
const gavel = group(cyl(0.22, 0.22, 0.9, W3, { rot: [0, 0, Math.PI / 2] }), cyl(0.06, 0.06, 1.2, W3, { pos: [0, -0.3, 0.55], rot: [Math.PI / 2.4, 0, 0] }));
gavel.position.set(2.5, 5.0, -2.6); gavel.rotation.y = -0.6; scene.add(gavel);
scene.add(cyl(0.45, 0.5, 0.15, W2, { pos: [2.5, 4.8, -2.6] }));

// counsel at podiums
const pro = character({ skin: '#f0c3a0', shirt: '#3b6fd8', hair: '#5a3422', hairStyle: 'short', expression: 'open', brows: 1, look: [0.5, 0.4] });
pro.position.set(-3.2, 0.6, 3.0); pro.rotation.y = 0.45; pro.scale.setScalar(0.85); scene.add(pro);
const con = character({ skin: '#a8714c', shirt: '#d84a3b', hair: '#1a1a1a', hairStyle: 'bob', expression: 'smirk', brows: -1, look: [-0.5, 0.4] });
con.position.set(3.2, 0.6, 3.0); con.rotation.y = -0.45; con.scale.setScalar(0.85); scene.add(con);
for (const [x, c] of [[-3.2, '#3b6fd8'], [3.2, '#d84a3b']]) {
  scene.add(box(1.8, 1.5, 0.9, 0.1, W1, { pos: [x, 0.75, 4.5] }));
  scene.add(box(1.5, 0.7, 0.1, 0.06, clay(c), { pos: [x, 0.9, 4.98] }));
  scene.add(box(2.0, 0.15, 1.1, 0.05, W3, { pos: [x, 1.55, 4.5], rot: [0.15, 0, 0] }));
}
// floor
scene.add(mesh(new THREE.PlaneGeometry(40, 40), wood('#4a2c18', '#2a180a', 512, 512, 0.45), { pos: [0, 0, 0], rot: [-Math.PI / 2, 0, 0] }));
// jury box (front) with 12 jurors, ballots secret
const jury = group(box(4.4, 1.2, 1.6, 0.12, W1, { pos: [0, 0.6, 0.3] }), box(4.6, 0.15, 1.8, 0.05, W3, { pos: [0, 1.25, 0.3] }));
const skins = ['#f0c3a0', '#c98e62', '#8a5a3a', '#eab896', '#d9a07a', '#6e4630'];
const hairs = ['#2a1a10', '#d8b060', '#1a1a1a', '#7a3a1a', '#4a2a18', '#bbbbbb'];
for (let i = 0; i < 12; i++) {
  const j = character({ skin: skins[i % 6], shirt: ['#4a6a8a', '#8a5a6a', '#5a7a5a', '#a07a4a'][i % 4], hair: hairs[(i * 5) % 6], hairStyle: ['short', 'bob', 'curly', 'grey'][i % 4], expression: ['flat', 'smile', 'sleepy'][i % 3], look: [0, 0.6], blush: false });
  const row = Math.floor(i / 6), col = i % 6; j.scale.setScalar(0.3); j.position.set(-1.75 + col * 0.7, 0.6 + (1 - row) * 0.55, -0.4 - (1 - row) * 0.7); jury.add(j);
  const card = box(0.42, 0.3, 0.04, 0.03, i < 8 ? clay('#2a1a10') : clay('#f4ead6'), { pos: [-1.75 + (i % 6) * 0.7, 1.45, 0.7 + (Math.floor(i / 6) - 1) * 0.25], rot: [-0.5, 0, 0] });
  jury.add(card);
}
jury.position.set(0, -0.2, 6.2); scene.add(jury);

keyLight(scene, { intensity: 2.6, color: '#fff0d8', pos: [-5, 12, 14], target: [0, 2, 0], size: 10 });
scene.add(new THREE.HemisphereLight('#ffe6c0', '#3a2414', 0.6));
const warm = new THREE.PointLight('#ffcf8a', 14, 14, 1.6); warm.position.set(0, 7, -1); scene.add(warm);

document.getElementById('ui').innerHTML = `
<style>
.case{position:absolute;left:150px;right:150px;top:220px;padding:18px 24px 22px;text-align:center;border-radius:22px;background:linear-gradient(#fffaf0,#f1e6d0);box-shadow:0 26px 60px rgba(40,20,5,.45),inset 0 2px 0 #fff}
.case small{font:700 22px Inter;letter-spacing:8px;color:#8a5a32}.case h1{font:900 52px Slab;color:#2a1a10;line-height:1.02;margin-top:10px}
.stamp{position:absolute;right:140px;top:360px;transform:rotate(-10deg);border:7px solid #d84a3b;color:#d84a3b;font:900 46px Slab;padding:2px 18px;border-radius:12px;background:rgba(255,248,236,.85);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.ex{position:absolute;width:330px;padding:18px 22px;border-radius:18px;font:800 32px Inter;color:#fff;line-height:1.15;box-shadow:0 22px 50px rgba(0,0,0,.4),inset 0 2px 0 rgba(255,255,255,.35)}
.ex b{display:block;font:900 20px Slab;letter-spacing:4px;opacity:.85;margin-bottom:8px}
.cap{position:absolute;left:0;right:0;bottom:250px;text-align:center;font:900 66px Inter;color:#fff;text-shadow:0 6px 24px rgba(0,0,0,.7)}
</style>
<div class="case"><small>CASE NO. 0412</small><h1>THE PEOPLE vs.<br>MULTITASKING</h1></div>
<div class="stamp">ON TRIAL</div>
<div class="ex" style="left:50px;top:960px;background:linear-gradient(160deg,#5a8cf0,#2f5cc4);transform:rotate(-3deg)"><b>EXHIBIT A · FOR</b>Answer emails during meetings.</div>
<div class="ex" style="right:50px;top:980px;background:linear-gradient(160deg,#f06a5a,#c43a2c);transform:rotate(3deg)"><b>EXHIBIT B · AGAINST</b>Switching costs 40% of your focus.</div>
<div class="cap">The jury <span style="color:#ffd27a">decides.</span></div>`;

await render(ctx, { bloom: [0.35, 0.6, 0.85], vignette: 0.45, tint: [1.03, 1.0, 0.95] });

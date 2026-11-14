import { THREE, setup, keyLight, render, character, clay, fabric, glossy, metal, glow, wood, box, sphere, cyl, capsule, torus, mesh, group } from '/v2/lib.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const ctx = setup({ bg: '#120a24', fov: 30, exposure: 1.05, envIntensity: 0.35 });
const { scene, camera } = ctx;
camera.position.set(0, 5, 30);
camera.lookAt(0, 4.5, 0);

// Back wall + acoustic panels
scene.add(mesh(new THREE.PlaneGeometry(40, 30), clay('#1d1238', { roughness: 0.95 }), { pos: [0, 5, -4] }));
const panelM = [fabric('#20163f'), fabric('#2a1a4d'), fabric('#1a1840')];
for (let r = 0; r < 7; r++) for (let c = -4; c <= 4; c++) {
  scene.add(box(1.5, 1.5, 0.35, 0.15, panelM[(r + c + 9) % 3], { pos: [c * 1.75, 0.6 + r * 1.75, -3.7] }));
}
// LED wash
const wash1 = new THREE.SpotLight('#ff7a3d', 45, 30, 0.7, 0.8); wash1.position.set(-6, 0, 2); wash1.target.position.set(-2, 6, -4); scene.add(wash1, wash1.target);
const wash2 = new THREE.SpotLight('#3dd6ff', 45, 30, 0.7, 0.8); wash2.position.set(6, 0, 2); wash2.target.position.set(2, 6, -4); scene.add(wash2, wash2.target);

// ON AIR sign
const font = await new Promise((r) => new FontLoader().load('/v2/node_modules/three/examples/fonts/helvetiker_bold.typeface.json', r));
const tg = new TextGeometry('ON AIR', { font, size: 0.62, depth: 0.12, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 4 });
tg.center();
const sign = group(
  box(4.1, 1.45, 0.3, 0.2, glossy('#1a0a12')),
  box(3.9, 1.25, 0.32, 0.18, glossy('#26101a')),
  mesh(tg, glow('#ff2d3d', 2.6), { pos: [0, 0, 0.22] }),
);
sign.position.set(0, 9.7, -2.9);
scene.add(sign);
const signLight = new THREE.PointLight('#ff2d3d', 18, 8, 1.5); signLight.position.set(0, 9.7, -1.6); scene.add(signLight);

// Characters
const maya = character({ skin: '#e8b48e', shirt: '#ff8a3d', hair: '#4a2a1a', hairStyle: 'bob', expression: 'open', look: [0.6, 0.1], brows: 1 });
maya.position.set(-2.25, 0.55, 0); maya.rotation.y = 0.3; scene.add(maya);
const dev = character({ skin: '#b97f56', shirt: '#2fb8e6', hair: '#141414', hairStyle: 'curly', expression: 'smirk', look: [-0.7, 0], brows: -1 });
dev.position.set(2.25, 0.55, 0); dev.rotation.y = -0.3; scene.add(dev);
// headphones
for (const ch of [maya, dev]) {
  const h = ch.userData.head;
  h.add(torus(1.12, 0.07, glossy('#1a1a1a'), { pos: [0, 0.05, 0], rot: [0, 0, 0] }, Math.PI));
  for (const sx of [-1, 1]) h.add(cyl(0.34, 0.34, 0.26, glossy('#222'), { pos: [sx * 1.08, -0.05, 0], rot: [0, 0, Math.PI / 2] }));
}
// rim lights
const rimA = new THREE.PointLight('#ff8a3d', 40, 9, 1.6); rimA.position.set(-3.8, 3.6, -2); scene.add(rimA);
const rimB = new THREE.PointLight('#3dd6ff', 40, 9, 1.6); rimB.position.set(3.8, 3.6, -2); scene.add(rimB);

// Desk
const deskTop = box(11, 0.3, 3.2, 0.12, wood('#6b4428', '#3e2412'), { pos: [0, 1.05, 1.4] });
scene.add(deskTop);
scene.add(box(10.6, 5, 2.8, 0.2, clay('#1c1430', { roughness: 0.7 }), { pos: [0, -1.6, 1.4] }));
scene.add(box(10.4, 0.06, 0.06, 0.02, glow('#b07cff', 2.2), { pos: [0, 0.75, 2.82], shadow: false }));

// Mics on short desk stands, beside each mouth
for (const [x, dir] of [[-2.2, 1], [2.2, -1]]) {
  const mx = x + dir * 1.45;
  scene.add(cyl(0.3, 0.34, 0.08, metal('#1e1e1e'), { pos: [mx, 1.24, 1.9] }));
  scene.add(cyl(0.045, 0.045, 0.9, metal('#2a2a2a'), { pos: [mx, 1.75, 1.9] }));
  scene.add(capsule(0.2, 0.42, metal('#161616', { roughness: 0.6 }), { pos: [mx, 2.35, 1.85], rot: [0.35, 0, dir * 0.2] }));
  scene.add(torus(0.22, 0.035, metal('#9a9a9a'), { pos: [mx, 2.23, 1.89], rot: [Math.PI / 2 + 0.35, 0, dir * 0.2] }));
}
// mugs
scene.add(cyl(0.22, 0.2, 0.45, glossy('#f4efe6'), { pos: [-4.1, 1.43, 2.2] }));
scene.add(torus(0.12, 0.04, glossy('#f4efe6'), { pos: [-3.88, 1.45, 2.2], rot: [0, 0, Math.PI / 2] }));
scene.add(cyl(0.22, 0.2, 0.45, glossy('#ff5a6e'), { pos: [4.1, 1.43, 2.1] }));

keyLight(scene, { intensity: 2.4, pos: [3, 10, 14], target: [0, 2, 0], size: 8 });
scene.add(new THREE.HemisphereLight('#8a7cff', '#1a1028', 0.5));

document.getElementById('ui').innerHTML = `
<style>
.q{position:absolute;left:0;right:0;top:470px;text-align:center;font:800 46px Inter;color:#fff;letter-spacing:-.5px;text-shadow:0 4px 20px rgba(0,0,0,.5)}
.q small{display:block;font:700 22px Inter;letter-spacing:6px;color:#b9a8ff;margin-bottom:10px}
.bub{position:absolute;padding:22px 30px;border-radius:30px;font:800 40px Inter;line-height:1.15;color:#fff;max-width:520px}
.bub.a{left:56px;top:670px;background:linear-gradient(160deg,#ffa266,#ff6a2a);box-shadow:0 20px 50px rgba(255,106,42,.45),inset 0 2px 0 rgba(255,255,255,.4)}
.bub.a:after{content:"";position:absolute;left:80px;bottom:-22px;border:16px solid transparent;border-top:22px solid #ff7a3a;border-bottom:0}
.bub.b{right:56px;top:850px;background:linear-gradient(160deg,rgba(61,214,255,.5),rgba(30,140,220,.35));opacity:.75}
.meter{position:absolute;left:290px;right:290px;top:600px;height:16px;border-radius:8px;background:linear-gradient(90deg,#ff8a3d 0 62%,#3dd6ff 62%);box-shadow:0 0 24px rgba(255,138,61,.6)}
.meter i{position:absolute;left:62%;top:-10px;width:36px;height:36px;margin-left:-18px;border-radius:50%;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.5)}
.plate{position:absolute;top:1430px;padding:14px 28px;border-radius:14px;font:800 30px Inter;letter-spacing:4px;color:#fff}
.cap{position:absolute;left:0;right:0;bottom:300px;text-align:center;font:900 72px Inter;color:#fff;letter-spacing:-1px;text-shadow:0 6px 24px rgba(0,0,0,.6)}
</style>
<div class="q"><small>EPISODE 12</small>Is coffee actually good for you?</div>
<div class="meter"><i></i></div>
<div class="bub a">Four cups a day lowers heart risk.</div>
<div class="bub b">Not if it's a sugar bomb.</div>
<div class="plate glass" style="left:120px">MAYA · FOR</div><div class="plate glass" style="left:640px">DEV · AGAINST</div>
<div class="cap">lowers <span style="color:#ff9a55">heart risk.</span></div>`;

await render(ctx, { bloom: [0.4, 0.5, 0.8], vignette: 0.4 });

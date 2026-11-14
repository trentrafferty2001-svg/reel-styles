import { THREE, setup, keyLight, render, character, clay, fabric, glossy, metal, glow, wood, box, sphere, cyl, capsule, torus, mesh, group } from '/v2/lib.js';

const ctx = setup({ bg: '#f3e6cf', fov: 30, exposure: 1.0, envIntensity: 0.7 });
const { scene, camera } = ctx;
camera.position.set(0, 7.0, 25); camera.lookAt(0.2, 5.5, 0);

scene.add(mesh(new THREE.PlaneGeometry(40, 30), clay('#f1e3c8', { roughness: 0.95 }), { pos: [0, 8, -5] }));
scene.add(mesh(new THREE.PlaneGeometry(40, 30), wood('#c89a6a', '#a87a4a', 512, 512, 0.5), { rot: [-Math.PI / 2, 0, 0] }));
// window with daylight
scene.add(box(4.2, 5.2, 0.3, 0.12, clay('#fffaf0'), { pos: [3.2, 9, -4.8] }));
scene.add(mesh(new THREE.PlaneGeometry(3.6, 4.6), glow('#fff6dc', 1.6), { pos: [3.2, 9, -4.6], shadow: false }));
scene.add(box(0.12, 4.6, 0.1, 0.04, clay('#fffaf0'), { pos: [3.2, 9, -4.55] }));
scene.add(box(3.6, 0.12, 0.1, 0.04, clay('#fffaf0'), { pos: [3.2, 9, -4.55] }));
// shelf + plant + books
scene.add(box(3.6, 0.2, 1.0, 0.05, wood('#a87048', '#7a4a28'), { pos: [-3.1, 8.6, -4.4] }));
['#c8613f', '#8aa58a', '#e0b45a', '#5a6a8a'].forEach((cc, i) => scene.add(box(0.35, 1.3 - i * 0.1, 0.8, 0.04, clay(cc), { pos: [-4.4 + i * 0.4, 9.35 - i * 0.05, -4.4] })));
const pot = cyl(0.45, 0.35, 0.8, clay('#c8613f'), { pos: [-2.1, 9.1, -4.4] }); scene.add(pot);
for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; scene.add(sphere(0.35, clay('#5a9a5a', { roughness: 0.5 }), { pos: [-2.1 + Math.cos(a) * 0.35, 9.8 + (i % 2) * 0.3, -4.4 + Math.sin(a) * 0.3], scale: [0.6, 1.3, 0.3], rot: [0, a, Math.cos(a) * 0.5] })); }

// desk
const deskW = wood('#d9a877', '#b07a48');
scene.add(box(10, 0.35, 4, 0.12, deskW, { pos: [0, 2.6, 1] }));
for (const sx of [-1, 1]) scene.add(box(0.3, 2.6, 3.6, 0.08, deskW, { pos: [sx * 4.6, 1.3, 1] }));
// character
const ch = character({ skin: '#f0c3a0', shirt: '#8aa58a', hair: '#5a3422', hairStyle: 'short', expression: 'smile', look: [0.5, 0.5], brows: 0.5 });
ch.position.set(-0.6, 1.9, -0.6); ch.rotation.y = 0.25; scene.add(ch);
// laptop
const lap = group(box(2.6, 0.12, 1.8, 0.05, metal('#c9c9cf', { roughness: 0.35 })), box(2.6, 1.7, 0.1, 0.05, metal('#c9c9cf', { roughness: 0.35 }), { pos: [0, 0.85, -0.9], rot: [-0.25, 0, 0] }));
lap.add(mesh(new THREE.PlaneGeometry(2.35, 1.45), glow('#dff0ff', 0.9), { pos: [0, 0.87, -0.84], rot: [-0.25 + Math.PI, Math.PI, 0], shadow: false }));
lap.position.set(1.0, 2.84, 1.6); lap.rotation.y = -0.5; scene.add(lap);
// mug with steam
scene.add(cyl(0.38, 0.34, 0.8, glossy('#c8613f'), { pos: [3.4, 3.18, 1.8] }));
scene.add(torus(0.22, 0.07, glossy('#c8613f'), { pos: [3.78, 3.2, 1.8], rot: [0, 0, Math.PI / 2] }));
for (let i = 0; i < 3; i++) scene.add(sphere(0.12 + i * 0.05, new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 - i * 0.08 }), { pos: [3.4 + Math.sin(i * 2) * 0.15, 3.9 + i * 0.45, 1.8], shadow: false }));
// lamp
scene.add(cyl(0.5, 0.55, 0.12, metal('#2b2420'), { pos: [-3.8, 2.84, 0.8] }));
scene.add(capsule(0.06, 2.2, metal('#2b2420'), { pos: [-3.6, 4.0, 0.6], rot: [0, 0, -0.25] }));
scene.add(mesh(new THREE.ConeGeometry(0.6, 0.8, 48, 1, true), clay('#c8613f', { side: THREE.DoubleSide }), { pos: [-3.0, 5.0, 0.8], rot: [0, 0, -2.2] }));
const bulb = sphere(0.2, glow('#ffe2a8', 4), { pos: [-2.75, 4.8, 0.8] }); scene.add(bulb);
const lampL = new THREE.PointLight('#ffd08a', 12, 8, 1.6); lampL.position.set(-2.6, 4.6, 0.9); scene.add(lampL);
// sticky notes
scene.add(box(0.7, 0.03, 0.7, 0.02, clay('#ffe27a'), { pos: [-1.9, 2.8, 2.4], rot: [0, 0.3, 0] }));
scene.add(box(0.7, 0.03, 0.7, 0.02, clay('#ff9a8a'), { pos: [-2.6, 2.8, 2.7], rot: [0, -0.2, 0] }));

keyLight(scene, { intensity: 2.8, color: '#fff2dc', pos: [8, 14, 10], target: [0, 2, 0], size: 9, radius: 10 });
scene.add(new THREE.HemisphereLight('#fff8ec', '#c89a6a', 0.7));

document.getElementById('ui').innerHTML = `
<style>
.title{position:absolute;left:0;right:0;top:250px;text-align:center;font:900 54px Nunito;color:#2b2420}
.dots{position:absolute;left:0;right:0;top:330px;display:flex;justify-content:center;gap:14px}.dots i{width:18px;height:18px;border-radius:50%;background:#e2d0b2;display:block}.dots i.on{background:#c8613f;width:44px;border-radius:9px}
.card{position:absolute;left:110px;right:110px;top:390px;padding:34px 36px 30px;border-radius:40px;background:linear-gradient(170deg,rgba(255,252,246,.96),rgba(255,248,236,.9));box-shadow:0 40px 80px rgba(110,70,30,.28),0 2px 0 #fff inset}
.badge{position:absolute;left:-24px;top:-24px;width:108px;height:108px;border-radius:50%;background:linear-gradient(150deg,#e07a55,#b84f2e);color:#fff;font:900 62px Nunito;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(184,79,46,.5),inset 0 3px 0 rgba(255,255,255,.35)}
.card h2{font:900 54px Nunito;margin-left:78px;color:#2b2420}.card p{font:600 28px Inter;color:#8a7a6a;margin:10px 0 0 78px}
.demo{margin-top:24px;background:#f6ecdc;border-radius:26px;padding:22px 30px;box-shadow:inset 0 2px 8px rgba(110,70,30,.12)}
.row{display:flex;align-items:center;justify-content:space-between;font:600 29px Inter;color:#2b2420;padding:8px 0}
.tog{width:104px;height:58px;border-radius:29px;background:linear-gradient(#97b897,#7a967a);position:relative;box-shadow:inset 0 2px 4px rgba(0,0,0,.15)}.tog:after{content:"";position:absolute;right:6px;top:6px;width:46px;height:46px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.25)}
.tog.off{background:#ddd0b8}.tog.off:after{left:6px;right:auto}
.prog{height:22px;border-radius:11px;background:#e5d6bd;margin-top:14px;overflow:hidden}.prog i{display:block;height:100%;width:72%;background:linear-gradient(90deg,#e07a55,#c8613f);border-radius:11px}
.cap{position:absolute;left:0;right:0;bottom:300px;text-align:center;font:900 70px Nunito;color:#c8613f;text-shadow:0 4px 0 #fff8ec,0 10px 30px rgba(110,70,30,.25)}
</style>
<div class="title">3 free tools for students</div>
<div class="dots"><i></i><i class="on"></i><i></i></div>
<div class="card"><div class="badge">2</div><h2>Focus mode</h2><p>Blocks distracting sites while you study.</p>
<div class="demo"><div class="row">Block social media <span class="tog"></span></div><div class="row" style="color:#ab9b8a">Allow music <span class="tog off"></span></div><div class="prog"><i></i></div></div></div>
<div class="cap">blocks <span style="color:#2b2420">distractions</span></div>`;
await render(ctx, { bloom: [0.2, 0.5, 0.9], vignette: 0.25, tint: [1.02, 1.0, 0.97] });

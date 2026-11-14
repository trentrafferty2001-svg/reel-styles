import { THREE, setup, render, clay, metal, glow, glossy, box, sphere, cyl, mesh, group, rng } from '/v2/lib.js';

const ctx = setup({ bg: '#1a1420', fov: 34, exposure: 1.0, envIntensity: 0.25, fog: new THREE.FogExp2('#c87a55', 0.0045) });
const { scene, camera } = ctx;
camera.position.set(-6, 3, 95); camera.lookAt(0, 16, 0);
const R = rng(5);
// sky dome with sunset gradient
const c = document.createElement('canvas'); c.width = 8; c.height = 1024; const x = c.getContext('2d');
const g = x.createLinearGradient(0, 0, 0, 1024);
g.addColorStop(0, '#0e1430'); g.addColorStop(0.35, '#3a2a55'); g.addColorStop(0.55, '#a04a5a'); g.addColorStop(0.68, '#f08a4a'); g.addColorStop(0.75, '#ffd08a'); g.addColorStop(1, '#ffd08a');
x.fillStyle = g; x.fillRect(0, 0, 8, 1024);
const skyT = new THREE.CanvasTexture(c); skyT.colorSpace = THREE.SRGBColorSpace;
const sky = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 32), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false }));
scene.add(sky);
// stars
for (let i = 0; i < 120; i++) { const a = R() * Math.PI - Math.PI / 2, b = 0.5 + R() * 1.0; scene.add(mesh(new THREE.SphereGeometry(0.18 + R() * 0.2, 6, 6), new THREE.MeshBasicMaterial({ color: '#fff', fog: false, transparent: true, opacity: 0.4 + R() * 0.6 }), { pos: [Math.sin(a) * 190 * Math.cos(b), Math.sin(b) * 190, -Math.cos(a) * 190 * Math.cos(b)], shadow: false })); }
// sun
scene.add(mesh(new THREE.SphereGeometry(9, 48, 48), new THREE.MeshBasicMaterial({ color: '#fff0c8', fog: false }), { pos: [40, 18, -170], shadow: false }));
const sunL = new THREE.DirectionalLight('#ffb070', 3.2); sunL.position.set(40, 18, -100); sunL.castShadow = true; sunL.shadow.mapSize.set(4096, 4096);
Object.assign(sunL.shadow.camera, { left: -30, right: 30, top: 30, bottom: -10, near: 1, far: 200 }); sunL.shadow.radius = 4; scene.add(sunL);
scene.add(new THREE.HemisphereLight('#6a5a9a', '#3a2010', 0.7));
// dunes (displaced plane)
const pg = new THREE.PlaneGeometry(400, 400, 200, 200); const pos = pg.attributes.position;
for (let i = 0; i < pos.count; i++) { const px = pos.getX(i), py = pos.getY(i); pos.setZ(i, Math.sin(px * 0.05) * 1.6 + Math.cos(py * 0.07 + px * 0.02) * 1.8 + Math.sin(px * 0.21 + py * 0.13) * 0.4); }
pg.computeVertexNormals();
scene.add(mesh(pg, clay('#5a3a28', { roughness: 0.95, clearcoat: 0 }), { rot: [-Math.PI / 2, 0, 0], pos: [0, -1.5, -60] }));
// distant mesas
for (let i = 0; i < 6; i++) scene.add(mesh(new THREE.CylinderGeometry(6 + R() * 6, 9 + R() * 8, 6 + R() * 8, 7), clay('#3a2430', { roughness: 1 }), { pos: [-80 + i * 32, 1, -120 - R() * 30], shadow: false }));
// launch pad
scene.add(cyl(7, 8, 1.2, clay('#4a4048', { roughness: 0.8 }), { pos: [3, 0, -6] }));
// rocket
const white = clay('#efe9e0', { roughness: 0.4, clearcoat: 0.6 }), dark = clay('#1e1c22', { roughness: 0.5 });
const prof = []; for (let i = 0; i <= 40; i++) { const t = i / 40; const y = t * 24; const r = t < 0.78 ? 1.35 : 1.35 * Math.cos(((t - 0.78) / 0.22) * Math.PI / 2) ** 0.8; prof.push(new THREE.Vector2(Math.max(0.001, r), y)); }
const rocket = group(mesh(new THREE.LatheGeometry(prof, 64), white));
[5, 10.5, 15].forEach((y) => rocket.add(cyl(1.37, 1.37, 0.5, dark, { pos: [0, y, 0] })));
for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; const fin = box(0.18, 3.2, 1.8, 0.06, dark, { pos: [Math.cos(a) * 1.5, 1.6, Math.sin(a) * 1.5], rot: [0, -a, 0] }); rocket.add(fin); }
rocket.add(cyl(0.9, 1.2, 1.2, metal('#3a3a3a'), { pos: [0, -0.5, 0] }));
// exhaust
rocket.add(mesh(new THREE.ConeGeometry(1.4, 7, 32), glow('#ffb35c', 6), { pos: [0, -4.6, 0], rot: [Math.PI, 0, 0], shadow: false }));
rocket.add(mesh(new THREE.ConeGeometry(0.75, 4.5, 32), glow('#fff4d0', 9), { pos: [0, -3.4, 0], rot: [Math.PI, 0, 0], shadow: false }));
rocket.position.set(3, 8, -6); scene.add(rocket);
const fire = new THREE.PointLight('#ff9a4a', 500, 40, 1.4); fire.position.set(3, 2, -3); scene.add(fire);
// smoke billows
const smokeM = clay('#c8a088', { roughness: 1, clearcoat: 0, transparent: true, opacity: 0.85 });
for (let i = 0; i < 18; i++) { const a = R() * Math.PI * 2, d = 3 + R() * 6; scene.add(sphere(1.4 + R() * 1.8, smokeM, { pos: [3 + Math.cos(a) * d, 1 + R() * 2, -6 + Math.sin(a) * d * 0.6], shadow: false })); }
// gantry tower
const steel = metal('#2a2a30', { roughness: 0.6 }); const tower = group();
for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tower.add(box(0.2, 30, 0.2, 0.02, steel, { pos: [dx * 1.2, 15, dz * 1.2] }));
for (let y = 0; y < 30; y += 2) { tower.add(box(2.6, 0.12, 0.12, 0.02, steel, { pos: [0, y, -1.2] })); tower.add(box(2.6, 0.12, 0.12, 0.02, steel, { pos: [0, y, 1.2] })); tower.add(box(2.8, 0.1, 0.1, 0.02, steel, { pos: [0, y + 1, 0], rot: [0, 0, 0.6] })); }
tower.add(box(4, 0.3, 0.3, 0.05, steel, { pos: [-2.5, 22, 0] }));
tower.position.set(-3.2, 0, -6.5); scene.add(tower);
// spectators silhouette
for (let i = 0; i < 26; i++) scene.add(group(sphere(0.32, dark, { pos: [0, 2.1, 0] }), mesh(new THREE.CapsuleGeometry(0.42, 1.0, 6, 12), dark, { pos: [0, 1.0, 0] })).translateX(-22 + i * 1.7 + R() * 0.6).translateZ(30 + R() * 3).translateY(-1.4));

document.getElementById('ui').innerHTML = `
<style>
.bars{position:absolute;left:0;right:0;top:0;height:5px;background:rgba(243,227,195,.18)}.bars i{display:block;height:100%;width:46%;background:#e0a24a;box-shadow:0 0 12px #e0a24a}
.chap{position:absolute;left:80px;top:290px;color:#f6e7c8}
.chap small{display:block;font:600 22px Inter;letter-spacing:12px;color:#e0a24a;margin-bottom:14px}
.chap div{font:italic 500 64px Playfair;letter-spacing:1px;text-shadow:0 4px 30px rgba(0,0,0,.5)}
.time{position:absolute;right:80px;top:300px;font:500 24px Inter;letter-spacing:4px;color:rgba(246,231,200,.7)}
.cap{position:absolute;left:90px;right:90px;bottom:320px;text-align:center;font:600 58px Inter;line-height:1.25;color:#f6e7c8;text-shadow:0 4px 24px rgba(0,0,0,.9)}
.cap span{opacity:.32}
</style>
<div class="bars"><i></i></div>
<div class="chap"><small>CHAPTER II</small><div>The Launch</div></div>
<div class="time">00:16 / 00:35</div>
<div class="cap">Half a million people <span>watched it leave the ground.</span></div>`;
await render(ctx, { bloom: [0.55, 0.6, 0.8], ao: false, vignette: 0.55, grain: 0.05, tint: [1.05, 0.98, 0.9] });

import { THREE, setup, keyLight, render, clay, metal, glossy, box, mesh, group } from '/v2/lib.js';

const ctx = setup({ bg: '#efe9dd', fov: 28, exposure: 0.85, envIntensity: 0.4 });
await Promise.all(['900 190px Inter', '600 48px Inter', '700 150px Playfair', '500 54px Inter', '900 220px Inter'].map((f) => document.fonts.load(f)));
const { scene, camera } = ctx;
camera.position.set(1.6, 5.0, 32); camera.lookAt(1.6, 5.0, 0);

function poster(draw) {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 1800; const x = c.getContext('2d'); draw(x, 1200, 1800);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}
const bauhaus = poster((x, w, h) => {
  x.fillStyle = '#f2e8d5'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#e63a2e'; x.beginPath(); x.arc(800, 540, 380, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#1d4fa8'; x.fillRect(110, 170, 420, 760);
  x.fillStyle = '#f2c21b'; x.beginPath(); x.moveTo(110, 1160); x.lineTo(600, 690); x.lineTo(1090, 1160); x.fill();
  x.fillStyle = '#111'; x.fillRect(110, 1200, 980, 30);
  x.font = '900 190px Inter'; x.fillText('GRAND', 100, 1420); x.fillText('OPENING', 100, 1600);
  x.font = '600 48px Inter'; x.fillText('BREW & CO  ·  SAT 9 AM', 110, 1700);
  x.beginPath(); x.arc(980, 1660, 70, 0, Math.PI * 2); x.fill(); x.fillStyle = '#f2e8d5'; x.beginPath(); x.arc(980, 1660, 28, 0, Math.PI * 2); x.fill();
});
const swiss = poster((x, w, h) => { x.fillStyle = '#e8e4dc'; x.fillRect(0, 0, w, h); x.fillStyle = '#e6332a'; x.fillRect(0, 0, w, 700); x.fillStyle = '#111'; x.font = '900 220px Inter'; x.fillText('Brew', 80, 1000); x.fillText('& Co.', 80, 1220); x.font = '500 54px Inter'; x.fillText('Grand opening', 80, 1500); });
const deco = poster((x, w, h) => { x.fillStyle = '#10241f'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d8b25a'; x.lineWidth = 10; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(600, 300); x.lineTo(150 + i * 112, 1100); x.stroke(); } x.fillStyle = '#d8b25a'; x.font = '700 150px Playfair'; x.textAlign = 'center'; x.fillText('BREW', 600, 1400); });

const wall = mesh(new THREE.PlaneGeometry(60, 40), clay('#d9cfbd', { roughness: 0.95 }), { pos: [0, 5, -0.5] }); scene.add(wall);
function frame(tex, w, h, pos, rotY = 0) {
  const g = group(box(w + 0.3, h + 0.3, 0.25, 0.04, clay('#1d1d1d', { roughness: 0.4 })), mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.15 }), { pos: [0, 0, 0.14], shadow: false }));
  g.position.set(...pos); g.rotation.y = rotY; scene.add(g); return g;
}
const main = frame(bauhaus, 5.8, 8.7, [3.0, 5.7, 1.2], -0.12);
main.rotation.z = 0.015;
frame(swiss, 4, 6, [10.2, 5.2, 0.2]);
frame(deco, 4, 6, [-5.4, 5.2, 0.2]);
// gallery spot lights
for (const [x, tx] of [[3.0, 3.0], [10.2, 10.2], [-5.4, -5.4]]) {
  const s = new THREE.SpotLight('#fff3dc', 140, 22, 0.42, 0.55, 1.4); s.position.set(x, 15, 7); s.target.position.set(tx, 5, 0); s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.radius = 8; scene.add(s, s.target);
}
scene.add(new THREE.HemisphereLight('#fff8ec', '#d8ccb4', 0.45));

document.getElementById('ui').innerHTML = `
<style>
.brief{position:absolute;left:60px;right:60px;top:260px;font:600 30px Inter;color:#7a7468}.brief b{color:#111}
.list{position:absolute;left:52px;top:380px;width:250px;font:600 29px Inter;line-height:54px;padding:10px 20px;border-radius:24px;background:rgba(255,253,248,.72);box-shadow:0 20px 50px rgba(60,40,10,.12);backdrop-filter:blur(10px)}
.list div{color:#c9c2b4}.list .p{color:#8f887a}.list .c{color:#111;font-weight:900;font-size:36px}
.list .c:before{content:"";display:inline-block;width:24px;height:6px;border-radius:3px;background:#e63a2e;margin-right:12px;vertical-align:middle}
.name{position:absolute;left:330px;right:30px;top:1520px;font:900 124px Inter;letter-spacing:-6px;line-height:1;color:#111}
.name i{font-style:normal;color:#e63a2e}
.sub{position:absolute;left:336px;top:1645px;font:600 40px Inter;color:#4a463e}
</style>
<div class="brief">Brief: <b>Coffee shop grand opening</b></div>
<div class="list"><div class="p">01 Swiss</div><div class="p">02 Brutalist</div><div class="p">03 Art Deco</div><div class="p">04 Risograph</div><div class="c">05</div><div>06 Y2K</div><div>07 Psych</div><div>08 Minimal</div><div>09 Memphis</div><div>10 Vaporwave</div><div>11 Editorial</div><div>12 Blueprint</div><div>13 Pixel</div></div>
<div class="name">BAUHAUS<i>.</i></div>
<div class="sub">Primary shapes, zero fuss.</div>`;
await render(ctx, { bloom: [0.1, 0.4, 0.98], dof: { focus: 29, aperture: 0.0025, maxblur: 0.01 }, vignette: 0.3 });

import { THREE, setup, render, metal, glow, glossy, cyl, torus, mesh, rng } from '/v2/lib.js';

const ctx = setup({ bg: '#05070a', fov: 30, exposure: 1.0, envIntensity: 0.6 });
const { scene, camera } = ctx;
camera.position.set(0, 0, 30); camera.lookAt(0, 0, 0);
const R = rng(11);
// glowing grid floor
const grid = new THREE.GridHelper(80, 60, '#1f8f55', '#0f3a24'); grid.position.set(0, -9, -10); grid.material.transparent = true; grid.material.opacity = 0.5; scene.add(grid);
// floating coins
const gold = metal('#ffc53d', { roughness: 0.25 });
for (let i = 0; i < 22; i++) {
  const c = cyl(0.9, 0.9, 0.18, gold, { pos: [-8 + R() * 16, -9 + R() * 20, -6 - R() * 18], rot: [R() * 3, R() * 3, R() * 3] });
  scene.add(c);
}
for (let i = 0; i < 4; i++) scene.add(torus(2 + i * 1.6, 0.03, glow('#3ddc84', 2), { pos: [0, 1, -12], rot: [0, 0, 0] }));
const l1 = new THREE.PointLight('#3ddc84', 300, 40, 1.2); l1.position.set(-4, 4, 0); scene.add(l1);
const l2 = new THREE.PointLight('#ffd27a', 150, 40, 1.2); l2.position.set(6, -4, 2); scene.add(l2);

document.getElementById('ui').innerHTML = `
<style>
@font-face{font-family:Mono;src:url(/src/fonts/mono.woff2);font-weight:400 800}
.win{position:absolute;left:56px;right:56px;top:280px;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,rgba(22,27,34,.88),rgba(13,17,23,.92));border:1.5px solid rgba(110,255,170,.18);box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 80px rgba(61,220,132,.15),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(14px)}
.tb{height:72px;background:rgba(255,255,255,.04);display:flex;align-items:center;padding:0 28px;gap:14px;font:500 25px Mono;color:#7d8590;border-bottom:1px solid rgba(255,255,255,.06)}
.tb i{width:20px;height:20px;border-radius:50%;display:block}
.code{padding:30px 36px 36px;font:500 32px/1.6 Mono;color:#d6e2ee;white-space:pre}
.g{color:#3ddc84;text-shadow:0 0 14px rgba(61,220,132,.6)}.c{color:#5cc8ff}.s{color:#ffcc66}.m{color:#6b7480}
.cur{display:inline-block;width:18px;height:38px;background:#3ddc84;vertical-align:middle;box-shadow:0 0 16px #3ddc84}
.total{position:absolute;right:28px;top:14px;font:800 30px Mono;color:#3ddc84;background:rgba(61,220,132,.12);border:1px solid rgba(61,220,132,.4);padding:6px 16px;border-radius:12px}
.card{position:absolute;left:56px;right:56px;top:1010px;height:270px;border-radius:28px;padding:34px 40px;background:linear-gradient(160deg,rgba(30,38,48,.9),rgba(16,20,26,.92));border:1.5px solid rgba(255,255,255,.1);box-shadow:0 40px 90px rgba(0,0,0,.6)}
.card h3{font:800 46px Inter;color:#fff}.card .sub{font:500 27px Inter;color:#7d8590;margin-top:6px}
.old{position:absolute;left:40px;bottom:36px;font:800 68px Mono;color:#6b7480}.old:after{content:"";position:absolute;left:-8px;right:-8px;top:52%;height:7px;border-radius:4px;background:#ff4d4d;transform:rotate(-7deg);box-shadow:0 0 12px #ff4d4d}
.new{position:absolute;left:390px;bottom:26px;font:800 96px Mono;color:#3ddc84;text-shadow:0 0 30px rgba(61,220,132,.7)}
.pill{position:absolute;right:40px;top:40px;background:#3ddc84;color:#04120a;font:900 32px Inter;padding:10px 24px;border-radius:30px;box-shadow:0 0 30px rgba(61,220,132,.6)}
.cap{position:absolute;left:0;right:0;top:1440px;text-align:center;font:700 56px Mono;color:#fff;text-shadow:0 4px 20px #000}
</style>
<div class="win"><div class="tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:18px">~/save-money — zsh</span><div class="total">Saved $407/yr</div></div>
<div class="code"><span class="g">$</span> swap <span class="c">--from</span> <span class="s">"Photoshop"</span>
<span class="m">  searching free alternatives…</span>
<span class="g">  ✓ Photopea</span> <span class="m">· runs in browser</span>
<span class="g">  ✓ opens PSD files</span>

<span class="g">$</span> swap <span class="c">--from</span> <span class="s">"Grammarly Premium"</span>
<span class="m">  searching free alternatives…</span>
<span class="g">  ✓ LanguageTool</span> <span class="m">· free tier</span>
<span class="g">$</span> <span class="cur"></span></div></div>
<div class="card"><div class="pill">FREE</div><h3>Photoshop → Photopea</h3><div class="sub">per year</div><div class="old">$263</div><div class="new">$0</div></div>
<div class="cap">Same files, <span style="color:#3ddc84">zero</span> cost.</div>`;
await render(ctx, { bloom: [0.5, 0.6, 0.6], ao: false, dof: { focus: 30, aperture: 0.004, maxblur: 0.012 }, vignette: 0.5 });

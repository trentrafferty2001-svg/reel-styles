// The 3D world for "Apollo 11: The Launch": one scene, posed per shot and per frame.
import { THREE, setup, makeComposer, clay, metal, glow, box, sphere, cyl, mesh, group, rng, W, H } from './lib3d.js';

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;

function gradientTexture(stops) {
  const c = document.createElement('canvas'); c.width = 8; c.height = 1024; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 1024); stops.forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g; x.fillRect(0, 0, 8, 1024);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function moonTexture() {
  const R = rng(42);
  // maria drawn small, then scaled up for a soft blur
  const m = document.createElement('canvas'); m.width = 128; m.height = 64; const mx = m.getContext('2d');
  mx.fillStyle = '#c4beb2'; mx.fillRect(0, 0, 128, 64);
  for (let i = 0; i < 22; i++) { mx.fillStyle = `rgba(100,98,94,${0.25 + R() * 0.3})`; mx.beginPath(); mx.ellipse(R() * 128, 12 + R() * 40, 4 + R() * 14, 3 + R() * 9, R() * 3, 0, Math.PI * 2); mx.fill(); }
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const x = c.getContext('2d');
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(m, 0, 0, 2048, 1024);
  for (let i = 0; i < 700; i++) {
    const cx = R() * 2048, cy = R() * 1024, r = 1.5 + R() ** 4 * 30;
    x.fillStyle = `rgba(80,78,74,${0.15 + R() * 0.25})`; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(240,236,228,.22)'; x.lineWidth = Math.max(1, r * 0.18); x.beginPath(); x.arc(cx - r * 0.12, cy - r * 0.12, r, 3.4, 5.8); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export async function buildWorld(container) {
  const ctx = setup({ container, bg: '#1a1420', fov: 34, exposure: 1.0, envIntensity: 0.25, fog: new THREE.FogExp2('#d9a07a', 0.0045) });
  const { scene, camera } = ctx;
  const R = rng(5);

  const daySky = gradientTexture([[0, '#24426e'], [0.38, '#6b80a8'], [0.6, '#e7a77a'], [0.7, '#ffd6a0'], [1, '#ffd6a0']]);
  const nightSky = gradientTexture([[0, '#03050c'], [0.45, '#0a1024'], [0.62, '#1a2448'], [0.7, '#2a2f55'], [1, '#2a2f55']]);
  const skyMat = new THREE.MeshBasicMaterial({ map: daySky, side: THREE.BackSide, fog: false });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(400, 32, 32), skyMat));
  const stars = group();
  for (let i = 0; i < 400; i++) {
    const a = R() * Math.PI * 2, b = 0.15 + R() * 1.3;
    stars.add(mesh(new THREE.SphereGeometry(0.4 + R() * 0.6, 6, 6), new THREE.MeshBasicMaterial({ color: '#fff', fog: false, transparent: true, opacity: 0.3 + R() * 0.7 }), { pos: [Math.cos(a) * 380 * Math.cos(b), Math.sin(b) * 380, Math.sin(a) * 380 * Math.cos(b)], shadow: false }));
  }
  scene.add(stars);

  const sun = mesh(new THREE.SphereGeometry(10, 48, 48), new THREE.MeshBasicMaterial({ color: '#fff0c8', fog: false }), { pos: [70, 30, -300], shadow: false });
  scene.add(sun);
  const sunL = new THREE.DirectionalLight('#ffc890', 3.0); sunL.position.set(40, 25, -60); sunL.castShadow = true; sunL.shadow.mapSize.set(2048, 2048);
  Object.assign(sunL.shadow.camera, { left: -40, right: 40, top: 40, bottom: -10, near: 1, far: 200 }); sunL.shadow.radius = 4; scene.add(sunL);
  const fill = new THREE.DirectionalLight('#9ab4ff', 0.6); fill.position.set(-30, 20, 60); scene.add(fill);
  const hemi = new THREE.HemisphereLight('#8a9ac8', '#4a3420', 0.8); scene.add(hemi);

  // ground: scrubland in front, ocean behind
  const pg = new THREE.PlaneGeometry(500, 260, 160, 80); const pos = pg.attributes.position;
  for (let i = 0; i < pos.count; i++) { const px = pos.getX(i), py = pos.getY(i); pos.setZ(i, Math.sin(px * 0.05) * 0.6 + Math.cos(py * 0.07 + px * 0.02) * 0.7 + Math.sin(px * 0.21 + py * 0.13) * 0.25); }
  pg.computeVertexNormals();
  scene.add(mesh(pg, clay('#6a6440', { roughness: 0.95, clearcoat: 0 }), { rot: [-Math.PI / 2, 0, 0], pos: [0, -1.2, 70] }));
  scene.add(mesh(new THREE.PlaneGeometry(1200, 600), new THREE.MeshPhysicalMaterial({ color: '#2f5f80', roughness: 0.12, metalness: 0.1, clearcoat: 1 }), { rot: [-Math.PI / 2, 0, 0], pos: [0, -1.0, -360], shadow: false }));
  scene.add(mesh(new THREE.PlaneGeometry(800, 18), clay('#d9c49a', { roughness: 1, clearcoat: 0 }), { rot: [-Math.PI / 2, 0, 0], pos: [0, -0.95, -62], shadow: false }));
  for (let i = 0; i < 40; i++) scene.add(sphere(2 + R() * 3, clay('#3e4a2a', { roughness: 1, clearcoat: 0 }), { pos: [-160 + i * 8 + R() * 4, -0.5, -45 - R() * 8], scale: [1.6, 0.6, 1], shadow: false }));

  // launch pad + flame trench
  scene.add(cyl(9, 10, 1.2, clay('#55505a', { roughness: 0.85 }), { pos: [0, 0, 0] }));
  scene.add(box(4, 1.4, 22, 0.1, clay('#2a2628'), { pos: [0, -0.2, 0] }));

  // tower
  const steel = metal('#2c2a30', { roughness: 0.6 }); const tower = group();
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tower.add(box(0.24, 30, 0.24, 0.02, steel, { pos: [dx * 1.3, 15, dz * 1.3] }));
  for (let y = 0; y < 30; y += 2) { tower.add(box(2.8, 0.14, 0.14, 0.02, steel, { pos: [0, y, -1.3] })); tower.add(box(2.8, 0.14, 0.14, 0.02, steel, { pos: [0, y, 1.3] })); tower.add(box(3.0, 0.1, 0.1, 0.02, steel, { pos: [0, y + 1, 0], rot: [0, 0, 0.6] })); }
  tower.add(box(2.4, 0.24, 0.6, 0.05, steel, { pos: [2.4, 22, 0] }));
  tower.add(box(0.4, 1.0, 0.4, 0.05, glow('#ff4040', 3), { pos: [0, 30.6, 0], shadow: false }));
  tower.position.set(-4.0, 0.6, -0.5); scene.add(tower);

  // rocket
  const white = clay('#efeae2', { roughness: 0.4, clearcoat: 0.6 }), dark = clay('#1e1c22', { roughness: 0.5 });
  const prof = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60, y = t * 24;
    let r = 1.35;
    if (t > 0.42 && t < 0.47) r = lerp(1.35, 1.05, (t - 0.42) / 0.05); else if (t >= 0.47) r = 1.05;
    if (t > 0.74) r = 1.05 * Math.cos(((t - 0.74) / 0.2) * Math.PI / 2) ** 0.7;
    if (t > 0.94) r = 0.08;
    prof.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  prof.push(new THREE.Vector2(0.001, 25.6));
  const rocket = group(mesh(new THREE.LatheGeometry(prof, 64), white));
  rocket.add(cyl(0.05, 0.05, 1.8, metal('#888'), { pos: [0, 24.6, 0] }));
  [3.5, 7.8, 13.2].forEach((y) => rocket.add(cyl(1.37, 1.37, 0.55, dark, { pos: [0, y, 0] })));
  rocket.add(cyl(1.07, 1.07, 0.4, dark, { pos: [0, 16.5, 0] }));
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; rocket.add(box(0.16, 2.6, 1.4, 0.05, dark, { pos: [Math.cos(a) * 1.55, 1.3, Math.sin(a) * 1.55], rot: [0, -a, 0] })); }
  for (let i = 0; i < 5; i++) { const a = (i / 4) * Math.PI * 2; const r = i === 4 ? 0 : 0.7; rocket.add(cyl(0.28, 0.42, 0.7, metal('#3a3a3a'), { pos: [Math.cos(a) * r, -0.3, Math.sin(a) * r] })); }
  const flame = group(
    mesh(new THREE.ConeGeometry(1.5, 8, 32, 1, true), glow('#ff9a3c', 3), { pos: [0, -4.4, 0], rot: [Math.PI, 0, 0], shadow: false }),
    mesh(new THREE.ConeGeometry(0.85, 5.5, 32, 1, true), glow('#fff2c8', 5), { pos: [0, -3.2, 0], rot: [Math.PI, 0, 0], shadow: false }),
  );
  rocket.add(flame);
  rocket.position.set(0, 0.95, 0); scene.add(rocket);
  const fire = new THREE.PointLight('#ff9a4a', 0, 60, 1.3); scene.add(fire);

  // smoke puffs
  const smokeMat = clay('#e2d4c6', { roughness: 1, clearcoat: 0, transparent: true, opacity: 0.92 });
  const ventMat = clay('#f2ece4', { roughness: 1, clearcoat: 0, transparent: true, opacity: 0.32, depthWrite: false });
  const puffs = [];
  for (let i = 0; i < 110; i++) {
    const m = mesh(new THREE.SphereGeometry(1, 24, 16), smokeMat, { shadow: false });
    m.userData = { a: R() * Math.PI * 2, sp: 2 + R() * 4.5, sz: 1 + R() * 1.6, y: R() * 1.5, delay: R() * 0.8, side: R() < 0.5 ? -1 : 1 };
    scene.add(m); puffs.push(m);
  }
  // exhaust trail for the climb
  const trailMat = new THREE.MeshStandardMaterial({ color: '#f4e6d8', emissive: '#ff9a50', emissiveIntensity: 0.1, transparent: true, opacity: 0.5, depthWrite: false, roughness: 1 });
  const trail = mesh(new THREE.CylinderGeometry(0.9, 3.2, 1, 32, 1, true), trailMat, { shadow: false });
  scene.add(trail);

  // crowd and cars
  const crowd = group(); const sil = clay('#141218', { roughness: 0.9, clearcoat: 0 });
  for (let i = 0; i < 46; i++) {
    const p = group(sphere(0.26, sil, { pos: [0, 2.2, 0] }), mesh(new THREE.CapsuleGeometry(0.36, 0.9, 6, 12), sil, { pos: [0, 1.25, 0], scale: [1.15, 1, 0.8] }), mesh(new THREE.CapsuleGeometry(0.14, 0.8, 4, 8), sil, { pos: [-0.17, 0.4, 0] }), mesh(new THREE.CapsuleGeometry(0.14, 0.8, 4, 8), sil, { pos: [0.17, 0.4, 0] }));
    p.position.set(-18 + i * 0.8 + R() * 0.5, -0.9 + R() * 0.2, 66 + R() * 5); p.scale.setScalar(0.9 + R() * 0.25);
    if (i % 7 === 3) p.add(mesh(new THREE.CapsuleGeometry(0.12, 0.9, 4, 8), sil, { pos: [0.4, 2.4, 0], rot: [0, 0, -0.4] }));
    crowd.add(p);
  }
  for (const x of [-12, 9, 15]) crowd.add(group(box(4.2, 1.2, 1.9, 0.4, sil, { pos: [0, 0.6, 0] }), box(2.4, 0.9, 1.7, 0.4, sil, { pos: [-0.2, 1.5, 0] })).translateX(x).translateZ(61).translateY(-0.9));
  scene.add(crowd);

  // moon (for the last shot)
  const moonT = moonTexture();
  const moon = mesh(new THREE.SphereGeometry(40, 96, 64), new THREE.MeshStandardMaterial({ map: moonT, roughness: 1, fog: false }), { pos: [38, 118, -300], shadow: false });
  scene.add(moon);
  const moonL = new THREE.DirectionalLight('#ffffff', 0); moonL.position.set(-200, 120, 200); moonL.target = moon; scene.add(moonL);
  const glint = group(sphere(0.6, glow('#ffd6a0', 8), { shadow: false }));
  const glintTrail = mesh(new THREE.CylinderGeometry(0.15, 0.02, 30, 8), new THREE.MeshBasicMaterial({ color: '#ffd6a0', transparent: true, opacity: 0.6, fog: false }), { pos: [0, -15, 0], shadow: false });
  glint.add(glintTrail); scene.add(glint);

  const { composer, grade, bloomPass } = makeComposer(ctx, { bloom: [0.55, 0.6, 0.8], vignette: 0.55, grain: 0.05, tint: [1.05, 0.98, 0.9], samples: 4 });

  const look = new THREE.Vector3();
  function setCam(p, l, fov = 34, shake = 0, seed = 0) {
    camera.position.set(p[0] + Math.sin(seed * 37.1) * shake, p[1] + Math.cos(seed * 51.7) * shake, p[2]);
    look.set(l[0], l[1] + Math.sin(seed * 43.3) * shake * 0.6, l[2]);
    camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  }

  function smoke(s, mode) {
    puffs.forEach((m, i) => {
      const u = m.userData;
      if (mode === 'vent') {
        const k = i < 8; m.visible = k; if (!k) return;
        m.material = ventMat;
        const ph = (s * 0.18 + i / 8) % 1;
        m.position.set(1.4 + ph * 5 + (i % 3) * 0.6, 3 + (i % 4) * 4.5 + ph * 2.5, 0.8 - ph * 1.5);
        m.scale.set(0.6 + ph * 2.2, 0.5 + ph * 1.4, 0.6 + ph * 2.2); return;
      }
      m.material = smokeMat;
      const t = s - u.delay;
      m.visible = t > 0;
      if (!m.visible) return;
      const r = 3 + u.sp * Math.sqrt(t) * 3.2;
      const sx = u.side * (0.6 + 0.4 * Math.abs(Math.cos(u.a)));
      m.position.set(sx * r * 1.3, u.y + 0.5 * t * (0.6 + u.sz * 0.5) + (i % 5) * 0.4, Math.sin(u.a) * r * 0.25 - 2);
      m.scale.setScalar(Math.min(4.2, u.sz * (0.9 + Math.sqrt(t) * 1.3)));
    });
  }

  function pose(shot, t, frameIndex) {
    grade.uniforms.seed.value = frameIndex * 0.731;
    const night = shot === 'moon';
    skyMat.map = night ? nightSky : daySky;
    stars.visible = night; moon.visible = night; glint.visible = night; sun.visible = !night;
    scene.fog.color.set(night ? '#0e1430' : '#d9a07a');
    scene.fog.density = shot === 'climb' ? 0.0016 : night ? 0.002 : 0.0045;
    sunL.intensity = night ? 0.05 : 3.0; fill.intensity = night ? 0.15 : 0.6; hemi.intensity = night ? 0.15 : 0.8;
    moonL.intensity = night ? 2.4 : 0;
    crowd.visible = shot === 'crowd';
    trail.visible = false; flame.visible = false; fire.intensity = 0;
    rocket.position.set(0, 0.95, 0); rocket.rotation.set(0, 0, 0); rocket.visible = !night;
    tower.visible = !night;
    flame.scale.set(1, 1, 1);

    if (shot === 'establish') {
      const k = ease(t / 3.7);
      smoke(t, 'vent');
      setCam([-14 + 2 * k, 3.2, 96 - 12 * k], [0, 13, 0], 34);
    } else if (shot === 'machine') {
      const k = ease(t / 5);
      smoke(t + 4, 'vent');
      setCam([7, 1.2, 19 - 2 * k], [0, lerp(4, 23, k), 0], 42);
    } else if (shot === 'crowd') {
      const k = ease(t / 4.4);
      smoke(t + 8, 'vent');
      setCam([2, 1.4, 92 - 3 * k], [0, 8, 0], 30);
    } else if (shot === 'liftoff') {
      const ign = 1.6, s = t - ign;
      if (s > 0) {
        const fl = clamp01(s / 0.6);
        flame.visible = true; flame.scale.set(0.6 + 0.4 * fl, fl * (1 + 0.08 * Math.sin(frameIndex * 1.7)), 0.6 + 0.4 * fl);
        fire.intensity = 260 * fl; smoke(s, 'big');
      } else smoke(t + 12, 'vent');
      const rise = s > 1.2 ? 1.6 * (s - 1.2) ** 2 : 0;
      rocket.position.y = 0.95 + rise;
      fire.position.set(0, rocket.position.y - 2, 3);
      const shake = s > 0 ? 0.35 * Math.exp(-s / 2.5) : 0;
      const k = ease(t / 5.7);
      setCam([-22 + 3 * k, 4.5, 78 - 5 * k], [0, 13 + rise * 0.8, 0], 34, shake, frameIndex);
    } else if (shot === 'climb') {
      const y = 60 + 14 * t + 5 * t * t;
      rocket.position.set(t * 1.5, y, 0); rocket.rotation.z = -0.02 * t;
      flame.visible = true; flame.scale.set(1.2, 2.2 + 0.1 * Math.sin(frameIndex * 1.9), 1.2);
      fire.intensity = 200; fire.position.set(rocket.position.x, y - 4, 2);
      trail.visible = true; trail.scale.set(1, y - 3, 1); trail.position.set(rocket.position.x * 0.5, (y - 3) / 2, 0);
      smoke(6 + t, 'big');
      setCam([-30, 2, 110], [rocket.position.x, y * 0.82, 0], 30);
    } else if (shot === 'moon') {
      const k = ease(t / 6.4);
      smoke(0, 'none'); puffs.forEach((m) => (m.visible = false));
      glint.position.set(lerp(-60, 30, k), lerp(20, 95, k), -280);
      glint.rotation.z = -0.9;
      setCam([0, 4, 60], [30, lerp(70, 82, k), -200], lerp(36, 30, k));
    }
    composer.render();
  }

  return { pose, canvas: ctx.renderer.domElement };
}

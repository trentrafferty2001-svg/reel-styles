// Shared 3D look for the reel-style previews: ACES tone mapping, image-based lighting, soft shadows,
// ambient occlusion, bloom, vignette + grain, and a vinyl-toy character kit.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export { THREE, RoundedBoxGeometry };
export const W = 1080, H = 1920;

export function setup({ container, bg = '#202030', fov = 30, exposure = 1.0, envIntensity = 0.6, fog = null } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  if (fog) scene.fog = fog;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = envIntensity;
  const camera = new THREE.PerspectiveCamera(fov, W / H, 0.5, 2000);
  return { renderer, scene, camera };
}

// Soft key light with a big shadow map
export function keyLight(scene, { color = '#fff4e0', intensity = 2.5, pos = [4, 8, 6], target = [0, 0, 0], size = 8, radius = 6 } = {}) {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.set(...pos);
  l.target.position.set(...target);
  l.castShadow = true;
  l.shadow.mapSize.set(2048, 2048);
  l.shadow.radius = radius;
  l.shadow.bias = -0.0004;
  l.shadow.normalBias = 0.02;
  Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 0.5, far: 60 });
  scene.add(l, l.target);
  return l;
}

const GradeShader = {
  uniforms: { tDiffuse: { value: null }, vignette: { value: 0.35 }, grain: { value: 0.035 }, tint: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 3.1 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float vignette, grain, seed; uniform vec3 tint; varying vec2 vUv;
    float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 0.5625;
      float v = smoothstep(0.75, 0.2, length(d)); c.rgb *= mix(1.0 - vignette, 1.0, v); c.rgb *= tint;
      c.rgb += (rnd(vUv * 1000.0) - 0.5) * grain; gl_FragColor = c; }`,
};

// Build the post-processing chain once; call composer.render() per frame.
export function makeComposer({ renderer, scene, camera }, { bloom = [0.35, 0.6, 0.85], ao = false, vignette = 0.35, grain = 0.035, tint = [1, 1, 1], samples = 4 } = {}) {
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  if (ao) { const g = new GTAOPass(scene, camera, W, H); g.blendIntensity = 0.85; composer.addPass(g); }
  const bloomPass = bloom ? new UnrealBloomPass(new THREE.Vector2(W, H), ...bloom) : null;
  if (bloomPass) composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  grade.uniforms.vignette.value = vignette;
  grade.uniforms.grain.value = grain;
  grade.uniforms.tint.value.set(...tint);
  composer.addPass(grade);
  return { composer, grade, bloomPass };
}

// ---------- materials ----------
export const clay = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, ...o });
export const fabric = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.9, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.4), ...o });
export const glossy = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08, ...o });
export const metal = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.28, ...o });
export const glow = (color, intensity = 3) => new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: intensity });

export function wood(base = '#7a4e2c', dark = '#5a3519', w = 512, h = 512, rough = 0.6) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 140; i++) {
    x.strokeStyle = dark; x.globalAlpha = 0.08 + Math.random() * 0.18; x.lineWidth = 1 + Math.random() * 3;
    const y0 = Math.random() * h; x.beginPath(); x.moveTo(0, y0);
    for (let xx = 0; xx <= w; xx += 32) x.lineTo(xx, y0 + Math.sin(xx / 70 + i) * 6 + Math.random() * 2);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return new THREE.MeshPhysicalMaterial({ map: t, roughness: rough, clearcoat: 0.35, clearcoatRoughness: 0.35 });
}

export const mesh = (geo, mat, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], shadow = true } = {}) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot); m.scale.set(...scale);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
};
export const box = (w, h, d, r, mat, o) => mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat, o);
export const sphere = (r, mat, o) => mesh(new THREE.SphereGeometry(r, 64, 48), mat, o);
export const cyl = (rt, rb, h, mat, o, seg = 64) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, o);
export const capsule = (r, l, mat, o) => mesh(new THREE.CapsuleGeometry(r, l, 12, 32), mat, o);
export const torus = (r, t, mat, o, arc = Math.PI * 2) => mesh(new THREE.TorusGeometry(r, t, 24, 96, arc), mat, o);
export const group = (...kids) => { const g = new THREE.Group(); kids.forEach((k) => k && g.add(k)); return g; };

// ---------- vinyl-toy character ----------
// Head radius 1 unit; total height ~3.2. Origin at the feet / seat line.
export function character({
  skin = '#f1c7a1', shirt = '#ff8a3d', hair = '#3a2418', hairStyle = 'short', eyes = '#2a1a12',
  expression = 'smile', look = [0, 0], brows = 0, glasses = false, blush = true, robe = false, hood = false, bodyScale = 1,
} = {}) {
  const g = new THREE.Group();
  const skinM = clay(skin, { roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color('#ffd9c0') });
  const shirtM = fabric(shirt);
  // torso: a soft bell
  const pts = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector2(0.001 + Math.sin(t * Math.PI * 0.5) ** 0.6 * (0.95 - 0.35 * t ** 2) * bodyScale, t * 1.5)); }
  pts.push(new THREE.Vector2(0.001, 1.5));
  const torso = mesh(new THREE.LatheGeometry(pts.reverse(), 64), robe ? fabric('#1b1b22') : shirtM, { pos: [0, 0, 0] });
  g.add(torso);
  if (hood) g.add(torus(0.62, 0.2, fabric(shirt), { pos: [0, 1.48, -0.1], rot: [Math.PI / 2.3, 0, 0] }));
  if (robe) g.add(mesh(new THREE.ConeGeometry(0.28, 0.4, 3), clay('#f4f4f0'), { pos: [0, 1.32, 0.62], rot: [-0.3, 0, Math.PI] }));
  // arms
  const armM = robe ? fabric('#1b1b22') : shirtM;
  g.add(capsule(0.2, 0.75, armM, { pos: [-0.92, 0.8, 0.1], rot: [0.2, 0, 0.35] }));
  g.add(capsule(0.2, 0.75, armM, { pos: [0.92, 0.8, 0.1], rot: [0.2, 0, -0.35] }));
  g.add(sphere(0.2, skinM, { pos: [-1.08, 0.3, 0.25] }));
  g.add(sphere(0.2, skinM, { pos: [1.08, 0.3, 0.25] }));
  g.add(cyl(0.28, 0.32, 0.3, skinM, { pos: [0, 1.55, 0] }));
  // head
  const head = new THREE.Group(); head.position.set(0, 2.45, 0); g.add(head); g.userData.head = head;
  head.add(sphere(1, skinM, { scale: [1, 0.96, 0.95] }));
  head.add(sphere(0.2, skinM, { pos: [-0.98, -0.02, 0], scale: [0.6, 1, 0.8] }));
  head.add(sphere(0.2, skinM, { pos: [0.98, -0.02, 0], scale: [0.6, 1, 0.8] }));
  head.add(sphere(0.12, skinM, { pos: [0, -0.08, 0.95] }));
  // eyes
  const white = glossy('#ffffff'), iris = glossy(eyes), hl = glow('#ffffff', 2);
  for (const sx of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sx * 0.34, 0.1, 0.8); head.add(e);
    e.add(sphere(0.2, white, { scale: [1, expression === 'sleepy' ? 0.55 : 1.1, 0.6], shadow: false }));
    e.add(sphere(0.12, iris, { pos: [look[0] * 0.06, look[1] * 0.06 - (expression === 'sleepy' ? 0.04 : 0), 0.08], scale: [1, 1.1, 0.6], shadow: false }));
    e.add(sphere(0.035, hl, { pos: [look[0] * 0.06 + 0.04, look[1] * 0.06 + 0.05, 0.15], shadow: false }));
    const brow = capsule(0.035, 0.22, clay(hair), { pos: [0, 0.32 + brows * 0.04, 0.05], rot: [0, 0, Math.PI / 2 + sx * brows * 0.25], shadow: false });
    e.add(brow);
    if (glasses) e.add(torus(0.25, 0.025, metal('#2a2a2a'), { pos: [0, 0, 0.12] }));
  }
  if (glasses) head.add(capsule(0.02, 0.1, metal('#2a2a2a'), { pos: [0, 0.12, 0.95], rot: [0, 0, Math.PI / 2] }));
  if (blush) for (const sx of [-1, 1]) head.add(sphere(0.13, clay('#ff8f80', { transparent: true, opacity: 0.45 }), { pos: [sx * 0.58, -0.22, 0.72], scale: [1, 0.6, 0.4], shadow: false }));
  // mouth
  const mouthM = clay('#5a2020', { roughness: 0.4 });
  if (expression === 'smile') head.add(torus(0.2, 0.045, mouthM, { pos: [0, -0.32, 0.9], rot: [0.25, 0, Math.PI] }, Math.PI));
  else if (expression === 'open') { head.add(sphere(0.16, mouthM, { pos: [0, -0.36, 0.88], scale: [1.2, 0.9, 0.4] })); head.add(sphere(0.08, clay('#ff7a7a'), { pos: [0, -0.42, 0.93], scale: [1.4, 0.6, 0.4] })); }
  else if (expression === 'flat') head.add(capsule(0.035, 0.22, mouthM, { pos: [0, -0.34, 0.9], rot: [0, 0, Math.PI / 2] }));
  else if (expression === 'smirk') head.add(torus(0.17, 0.04, mouthM, { pos: [0.06, -0.32, 0.9], rot: [0.25, 0, Math.PI + 0.35] }, Math.PI * 0.75));
  else if (expression === 'sleepy') head.add(torus(0.12, 0.04, mouthM, { pos: [0, -0.34, 0.9], rot: [0.25, 0, Math.PI] }, Math.PI));
  // hair
  const hairM = clay(hair, { roughness: 0.45, clearcoat: 0.5 });
  const capOf = (r, theta, tilt, pos = [0, 0, 0], scale = [1, 1, 1]) => {
    const m = mesh(new THREE.SphereGeometry(r, 64, 32, 0, Math.PI * 2, 0, theta), hairM, { pos, rot: [tilt, 0, 0], scale });
    head.add(m); return m;
  };
  if (hairStyle === 'short') {
    capOf(1.05, Math.PI * 0.5, -0.45, [0, 0.02, -0.02]);
    head.add(sphere(0.3, hairM, { pos: [-0.3, 0.86, 0.42], scale: [1.4, 0.55, 0.9] }));
    head.add(sphere(0.28, hairM, { pos: [0.25, 0.9, 0.4], scale: [1.4, 0.5, 0.9] }));
  } else if (hairStyle === 'bob') {
    capOf(1.12, Math.PI * 0.62, -0.75, [0, 0.05, -0.05]);
    for (const sx of [-1, 1]) head.add(sphere(0.42, hairM, { pos: [sx * 0.88, -0.25, -0.05], scale: [0.55, 1.15, 1] }));
    head.add(sphere(0.4, hairM, { pos: [0.15, 0.78, 0.5], scale: [1.9, 0.42, 0.8], rot: [0, 0, -0.15] }));
  } else if (hairStyle === 'grey') {
    capOf(1.05, Math.PI * 0.32, -0.6, [0, 0.03, -0.05]);
    for (const sx of [-1, 1]) head.add(sphere(0.38, hairM, { pos: [sx * 0.86, 0.12, -0.2], scale: [0.6, 1, 1.1] }));
  } else if (hairStyle === 'curly') {
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 * 3, b = 0.3 + (i / 30) * 1.1;
      const x = Math.sin(b) * Math.cos(a), z = Math.sin(b) * Math.sin(a), y = Math.cos(b);
      if (z > 0.55 && y < 0.6) continue;
      head.add(sphere(0.3, hairM, { pos: [x * 0.98, y * 0.95 + 0.12, z * 0.95 - 0.08] }));
    }
  } else if (hairStyle === 'hood') {
    capOf(1.16, Math.PI * 0.6, -1.15, [0, 0.05, -0.12], [1, 1, 1]);
  }
  return g;
}

// Glassy floating card text helper (HTML overlays live in each page)
export function rng(seed = 1) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

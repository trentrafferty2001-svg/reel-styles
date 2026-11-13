---
name: reel-base
description: The shared pipeline every reel-* style skill builds on - Remotion project setup, script length, Fish Audio voice (one voice or several stitched), word-timed captions, free synthesized sound effects, stills check and render for a 1080x1920 vertical reel. Load it whenever a reel-* style skill says to; use it directly only when the user wants a reel with no named style.
---

# Reel base pipeline

Every style in this repo makes the same kind of thing: a ~35 s vertical (1080×1920, 30 fps) reel, fully code-animated
in Remotion, with a Fish Audio voiceover, word-timed captions and sound effects. The style skill decides the look,
the beat sheet and the scene components; this file is how it gets built.

`<base>` below is this skill's folder. Videos live in `videos/<slug>/` of the current repo.

## Budget rule
Free only unless the user says otherwise. Remotion, FFmpeg, the SFX script and fonts are free. Fish Audio is the one
paid call: check credit first (`curl -sS -H "Authorization: Bearer proxy-injected" https://api.fish.audio/wallet/self/api-credit`)
and don't re-take voice lines without reason (each take is billed). No paid image or video generators: anything a
style calls "footage" is built in code (see each style's notes).

## 1. Project
```bash
npx create-video@latest --yes --blank videos/<slug>
rm -rf videos/<slug>/.git videos/<slug>/src/Composition.tsx
bash <base>/scripts/setup-project.sh videos/<slug>       # Inter font into public/fonts, pre-installed Chromium
bash <base>/scripts/make-sfx.sh videos/<slug>            # public/sfx/*.wav
```
In `videos/<slug>/.gitignore`, replace `out` with `out/*` and `!out/*.mp4`. Extra fonts a style asks for: download
the woff2 from Google Fonts into `public/fonts/` the same way `setup-project.sh` does for Inter and load it in
`src/theme.ts` (template: `<base>/templates/theme.ts`) with `FontFace` + `delayRender` (never `@import` a Google Fonts URL at render time).

## 2. Script
`narration.txt` holds the exact spoken words. About 2.4 words per second, plus 1.5 s for the end card:
**35 s ≈ 80 words.** Follow the style's beat sheet; keep sentences short; one idea per sentence. Voice directions in
`[brackets]` and `<emphasis>` tags are allowed (see `<base>/references/fish-audio-drama-3.md`).

If the user gives only a topic, write the script, the voice-over with emotion tags and the scene list with timings
(the three things the style prompt asks for), show them briefly, then build. Don't wait for approval unless the user
asked to review first.

## 3. Voice
**One voice:**
```bash
FISH_API_KEY=proxy-injected node <base>/scripts/fish-voiceover.mjs videos/<slug> --voice <id> [--speed 1.15]
```
**Several voices** (podcast, courtroom, night desk helper): split the script into one folder per line, in order:
```
videos/<slug>/lines/01-host-a/narration.txt
videos/<slug>/lines/02-host-b/narration.txt
...
```
Run `fish-voiceover.mjs` on each folder with that speaker's `--voice`, then
```bash
node <base>/scripts/merge-voices.mjs videos/<slug> --gap 0.25
```
which writes the joined `public/voiceover.mp3`, `src/captions.json` (each word also has `speaker` and `line`) and
`src/lines.json` (start/end of every line). Use `lines.json` to switch shots between speakers.

Public Drama 3 voices: Adrian `bf322df2096a46f18c579d0baa36f41d` (male), Delia `c70cfb98867a4bfb9ae20d2401257b92`
(female), Sheila `f3a2b90078d54a65af4b95f63bc7798e` (female). More in the Fish voice library.

From here on, **all timing comes from `src/captions.json`.**

## 4. Composition
`src/Root.tsx` sizes the video to the voice:
```tsx
import { Composition } from "remotion";
import captions from "./captions.json";
import { Reel } from "./Reel";
const FPS = 30;
const lastMs = captions.length ? captions[captions.length - 1].endMs : 3000;
export const RemotionRoot: React.FC = () => (
  <Composition id="Reel" component={Reel} durationInFrames={Math.ceil((lastMs / 1000 + 1.5) * FPS)}
    fps={FPS} width={1080} height={1920} />
);
```
`src/Reel.tsx`: audio, scenes in `<Sequence>`s that start on the first word of their line, SFX, captions on top.
```tsx
// Start frame of the first word of a phrase. Returns the FIRST match: for repeated words, pass a longer phrase.
const at = (phrase: string, fps: number) => {
  const target = phrase.toLowerCase().split(/\s+/);
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
  for (let i = 0; i < captions.length; i++)
    if (target.every((w, j) => clean(captions[i + j]?.text ?? "") === clean(w)))
      return Math.round((captions[i].startMs / 1000) * fps);
  throw new Error(`phrase not found in captions: ${phrase}`);
};
```
Sound effects: `<Sequence from={at("guilty", fps)}><Html5Audio src={staticFile("sfx/gavel.wav")} volume={0.7} /></Sequence>`.
Keep SFX under the voice (volume 0.3 to 0.7) and loops like `rain.wav` / `hum.wav` around 0.15, using `loop`.

Animate only from `useCurrentFrame()` with `interpolate` / `spring`; no CSS transitions, timers, `Date.now()` or
`Math.random()` (use `random(seed)`). Inside a `<Sequence>` the frame starts at 0; pass later hit points as props
(`hit={at("but", fps) - start}`).

**Safe areas:** keep ~250 px clear top and bottom for app buttons; captions sit in the lower third
(`paddingBottom: 420`) unless the style places them elsewhere.

## 5. Captions
Pages of up to 6 words that end at sentence ends (or a comma after 3+ words); the spoken word is highlighted; a
page clears 0.4 s after its last word during a pause. Each style sets the font, size, colours and position. For
1-2 word punch captions, cap pages at 2 words instead of 6. Start from `<base>/templates/Captions.tsx` (and
`<base>/templates/theme.ts` for the font loader): copy both into `src/` and restyle.

## 6. Check and render
Inside `videos/<slug>/`:
```bash
npx remotion compositions
npx remotion still Reel out/f-01.png --frame=<frame in scene 1>     # one per scene, plus the last frame
bash <base>/scripts/check-video.sh sheet out/sheet.png out/f-*.png
npx remotion render Reel out/<slug>.mp4
bash <base>/scripts/check-video.sh spec out/<slug>.mp4
```
Look at the contact sheet before the final render: every scene shows its line, no text clipped or under the
captions, the style's palette and fonts throughout, a clean end card. Then send the MP4 with SendUserFile and list
one line per scene.

## 7. The 3D look (default for every style)
Every style is rendered as a lit 3D scene, not flat shapes: vinyl-toy characters, soft shadows, image-based
lighting, bloom on anything that glows, film grain and a vignette. Text, captions, cards and counters stay as
crisp HTML on top. Reference frames for each style are in `previews/<style>.png`, built from
`previews/v2/scenes/<style>.js`: start a new video's world from that style's scene file.

**Setup (in `videos/<slug>/`):**
```bash
npm i three@0.170.0 @types/three@0.170.0
cp <base>/three/lib3d.js <base>/three/Stage.tsx src/
echo 'Config.setChromiumOpenGlRenderer("swangle");' >> remotion.config.ts   # software WebGL for headless renders
```
and add `"allowJs": true` to `tsconfig.json`.

**How it fits together:**
- `src/world.js` exports `buildWorld(container)`: it calls `setup({ container, ... })`, builds the scene once
  with the `lib3d.js` helpers (`clay`, `fabric`, `glossy`, `metal`, `glow`, `wood`, `box`, `sphere`, `character`, ...),
  creates the post chain with `makeComposer(ctx, { bloom, vignette, grain, tint })`, and returns
  `{ pose(shot, t, frame), canvas }`. `pose` places the camera and every moving thing for that moment and calls
  `composer.render()`.
- **`pose` must be a pure function of (shot, t)**: no state carried between frames. Remotion renders frames out
  of order and in several tabs at once.
- `src/Stage.tsx` builds the world once per tab and calls `pose` inside `delayRender` for each frame. Put
  `<Stage shot="liftoff" t={frame / fps} />` inside each shot's `<Sequence>`, with HTML overlays after it.
- Cuts: a 6-frame dip through black between shots is cheap and reads as cinematic.

**Cost and speed:** 3D renders in software here, so keep it lean: shadow maps at 2048, `ao: false` unless the
scene is small, no canvas `filter: blur()` in textures (it can time out a frame; draw small and scale up). Render
with `npx remotion render Reel out/<slug>.mp4 --concurrency=4 --timeout=120000`. Check stills of every shot first:
each still takes ~6 s.

---
name: reel-documentary
description: Makes a 35 s vertical documentary-style reel about a topic - cinematic code-built scenes with slow push-ins, a film-title card with a runtime bar, a calm narrator, a warm colour grade and word-by-word captions. Use for big topics, history, or explainers that should feel like a film, or when the user runs /reel-documentary.
---

# Documentary reel

**Starting prompt:** Make a 35-second vertical documentary reel about [TOPIC]. Cinematic footage, a film-title card
with a runtime bar, a calm narrator voice, slow push-ins, warm colour grade, word-by-word captions.

Build with the `reel-base` pipeline (load it first). This file is the look and the structure.

## Look
- **Grade:** warm. Blacks lifted to `#14100c`, highlights `#f3e3c3`, accent amber `#e0a24a`. Over every scene add a
  grade layer: a radial vignette (transparent centre → `rgba(0,0,0,0.65)` at the edges), a warm overlay
  (`#ff9a3c` at 8% with `mixBlendMode: "soft-light"`) and film grain (an SVG `feTurbulence` noise rect at 6-8%
  opacity whose `seed` changes every 2 frames).
- **Letterbox feel:** thin black bars 90 px top and bottom inside the safe area are optional; keep captions above
  the bottom one.
- **Type:** titles in a serif (Playfair Display or DM Serif Display, saved to `public/fonts`), wide letter-spacing
  for small caps labels; captions in Inter 600, off-white, no box, soft shadow.
- **Motion:** everything slow. Each shot pushes in 4-8% over its length (`scale` 1.0 → 1.06) with a slight drift;
  cross-dissolves of 10-14 frames between shots; never a hard pop.

## "Footage" for free
No paid video generators. Each shot is a layered 2.5D scene built in code: background gradient sky or room, 3-5 SVG
silhouette layers at different depths moving at different speeds (parallax), light shafts (blurred white polygons
at 10% opacity), dust particles (`random(seed)` dots drifting up), maybe one hero object drawn large. If real
imagery suits the topic, public-domain images (NASA, Library of Congress, Wikimedia Commons PD) can be downloaded
into `public/img/` and pushed in Ken Burns style; note the source in `plan.md`.

## Beat sheet (35 s, ~80 words)
| Time | Beat | On screen |
|---|---|---|
| 0-3 s | Cold open line, a striking fact | Wide establishing shot, slow push-in |
| 3-6 s | Title card | Black, serif title fades up letter by letter, small caps subtitle ("A short film about…"), a **runtime bar**: a 600 px hairline that fills left to right with `00:00 / 00:35` under it |
| 6-27 s | 3-4 chapters, one idea each | One shot per chapter; a small chapter label top-left ("I. The Spark") fades in for 2 s |
| 27-33 s | The meaning / what it changed | The widest, brightest shot; push-in continues |
| 33-35 s | End card | Black, title again small, CTA line |

Keep the runtime bar alive as a 4 px line along the top edge for the whole reel after the title card (fills with
the playhead), the "film" signature of the style.

## Voice and sound
- One calm narrator: Adrian at speed 1.05-1.1, directions like `[calm, documentary narrator, unhurried]`, a
  `[short pause]` before the title.
- Sound: `hum.wav` loop at 0.12 for room tone, `riser.wav` into the title card, a soft `thud.wav` on the title.

## Captions
Word by word: show one sentence at a time centred at y≈1350, words fade in as they are spoken (opacity 0.25 → 1),
no colour highlight.

---
name: reel-poster-styles
description: Makes a 35 s vertical reel that shows one design brief rendered as 20 different poster styles - a numbered list on the left, each poster flipping in on the beat, the style name in big type and a save-this ending. Use for design content, before/after and variety posts, or when the user runs /reel-poster-styles.
---

# Poster styles reel

**Starting prompt:** Make a 35-second vertical reel showing one brief, [BRIEF], as 20 poster styles. A numbered list
on the left, each poster flipping in on the beat, style name in big type, a save-this ending.

Build with the `reel-base` pipeline (load it first). Every poster is drawn in code (SVG/CSS in Remotion), no image
generators.

## Look
- **Frame:** off-white page `#f4f1ea`, ink `#111`. Left column (x 60-330): the numbered list 01-20 in Inter 600,
  28 px; the current number turns ink-black and bold with a short bar beside it, past ones grey `#9a958c`, future
  ones `#cfcac0`. The list scrolls so the current item stays near the middle.
- **Poster area** (x 360-1020, y 380-1400, 2:3 ratio): one poster at a time, with a soft drop shadow.
- **Flip:** each poster enters with a 3D card flip (`rotateY` 90° → 0° over 8 frames, `perspective: 1600px`) on the
  beat, the previous one flips out.
- **Style name** below the poster in huge type (Inter 900, 110 px, tight tracking), e.g. "SWISS", "BRUTALIST",
  set in a font/colour that hints at that style.
- **Brief** small at the top: "Brief: [BRIEF]".

## The 20 styles (each a small React component taking the brief's title, subtitle and one icon)
Swiss grid · Bauhaus · Brutalist · Art Deco · Risograph · Y2K chrome · Psychedelic 60s · Minimal mono · Constructivist ·
Memphis · Vaporwave · Editorial serif · Blueprint · Pixel / 8-bit · Neo-tokyo neon · Japanese minimal · Collage /
cut paper · Pop art halftone · Gradient mesh · Typographic only.
Each uses 2-3 colours, a distinct layout and a font that fits (save the few you need into `public/fonts`). Reuse
patterns (halftone dots, grids, noise) via shared SVG `<pattern>`s.

## Timing (35 s, ~70 words)
Short narration intro then mostly visual:
| Time | Beat |
|---|---|
| 0-3 s | "One brief. Twenty styles." The brief card types in |
| 3-31 s | 20 posters, ~1.4 s each, flips land on a steady beat; narration names a few highlights, not all 20 |
| 31-35 s | Save-this ending: all 20 as a 4×5 thumbnail grid zooming out, "Save this for your next project" with a bookmark icon that bounces |

Keep the beat steady (every 42 frames) even when narration runs over; voice is secondary here.

## Voice and sound
- One voice, upbeat and quick (Delia or Adrian, speed 1.15, `[upbeat, quick]`).
- `whoosh.wav` (quiet) or `click.wav` on every flip, `ding.wav` on the grid ending. Optional `tick.wav` metronome
  at 0.15 to sell the beat.

## Captions
Small and top-centre under the brief (the bottom is busy), 3-5 words per page.

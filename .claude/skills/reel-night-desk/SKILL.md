---
name: reel-night-desk
description: Makes a 35 s vertical story reel - a character at a night desk with rain on the window and a lamp hits a problem, a helper appears with the fix, step cards pop in on each line, ending with a comment-keyword pill. Use for stories, tutorials and how-it's-made content, or when the user runs /reel-night-desk.
---

# Night desk story reel

**Starting prompt:** Make a 35-second vertical story reel: a character at a night desk with rain on the window and a
lamp. They hit a problem, a helper appears with the fix, step cards pop in on each line, ending with a
comment-keyword pill.

Build with the `reel-base` pipeline (load it first). Use its several-voices path if the helper speaks.

**3D look:** render it in 3D (reel-base section 7). The reference frame is `previews/night-desk.png`; start the world from `previews/v2/scenes/night-desk.js`. The colours and layout below still apply; flat-drawing details (outline widths, SVG shapes) translate to 3D materials and lighting.

## Look
- **Scene:** a cosy dark room. Wall `#161a2e`, window upper left showing a deep blue night city (`#0d1b3a` with a
  few lit windows in `#ffd27a`), **rain**: 80-120 thin diagonal streaks falling at varied speeds (`random(seed)` per
  drop, wrapped with modulo on the frame), plus a few droplets sliding down the glass.
- **Lamp:** a desk lamp casting a warm cone (`radial-gradient` from `rgba(255,190,110,0.55)` to transparent) over
  the desk; everything outside the cone is cool and dim. The lamp flickers once when the problem hits.
- **Character:** seen from a 3/4 back-side angle at the desk with a laptop, hoodie, simple shapes. The laptop screen
  glow lights their face (cyan-white). Poses: typing, head in hands (problem), turning to the helper, typing
  happily.
- **Helper:** appears with a soft glow and sparkle particles, e.g. a little floating robot, a cat, or a glowing
  sticky note with a face. Original design, 2-3 colours, hovers with a gentle sine bob.
- **Step cards:** each step of the fix pops in (spring) as a frosted card (`rgba(255,255,255,0.1)`, `backdrop`-style
  blur faked with a blurred copy behind) with a number, a short title and an icon; at most 3 on screen, older
  ones shrink and stack.
- **Ending pill:** a big rounded pill centre screen: `Comment "[KEYWORD]"` with a chat icon, pulsing gently, plus
  a small line "and I'll send you the [thing]". Use the keyword the user gives, or ask for one.

## Beat sheet (35 s, ~80 words)
| Time | Beat |
|---|---|
| 0-4 s | Set the scene: late night, rain, they're trying to do [TASK] |
| 4-9 s | The problem hits: error / blocker, lamp flicker, head in hands |
| 9-12 s | Helper appears with sparkle |
| 12-30 s | 3-4 step cards, one per line of the fix; character follows along, mood lifting |
| 30-35 s | It works; comment-keyword pill |

## Voice and sound
- Narrator: Adrian, `[quiet, late-night storyteller]`, speed 1.1. Optional helper voice (Delia or Sheila,
  `[warm, a little magical]`) for one or two lines.
- `rain.wav` loop at 0.15 throughout, `thud.wav` on the problem, `riser.wav` + `ding.wav` for the helper,
  `pop.wav` per step card.

## Captions
Soft: Inter 700, 60 px, warm white `#fff2df`, current word in lamp amber `#ffbe6e`, lower third, 3-5 words.

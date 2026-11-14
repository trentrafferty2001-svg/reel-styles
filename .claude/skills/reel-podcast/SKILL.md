---
name: reel-podcast
description: Makes a 35 s vertical podcast-style reel where two animated hosts argue a question at a studio desk - ON AIR sign, mics, name plates, a chat bubble per point, a different voice for each host and the winner revealed at the end. Use for debates, opinions and two sides of a question, or when the user runs /reel-podcast.
---

# Podcast reel

**Starting prompt:** Make a 35-second vertical podcast reel where two characters argue about [QUESTION]. Studio
desk, ON AIR sign, mics, name plates, chat bubbles for each point, a different voice for each host, the winner
revealed at the end.

Build with the `reel-base` pipeline (load it first), using its **several voices** path.

**3D look:** render it in 3D (reel-base section 7). The reference frame is `previews/podcast.png`; start the world from `previews/v2/scenes/podcast.js`. The colours and layout below still apply; flat-drawing details (outline widths, SVG shapes) translate to 3D materials and lighting.

## Look
- **Studio:** deep purple-to-navy back wall (`#1b1035` → `#0d1430`) with soft acoustic-panel rectangles, a warm desk
  (`#3a2a20` top edge highlight) across the lower middle at y≈1150.
- **ON AIR sign** top centre: rounded box, red `#ff3b3b` text and glow that pulses gently (`opacity` 0.8-1 on a
  60-frame sine) and flickers on at the start.
- **Hosts:** two flat-vector characters behind the desk, left and right (simple shapes: head circle, hair shape,
  shoulders, eyes that blink every ~3 s with `random(seed)` offsets). Host A's colour orange `#ff8a3d`, Host B's
  cyan `#3dd6ff`. Each has a mic on a boom arm and a **name plate** on the desk front ("MAYA · FOR", "DEV · AGAINST").
- **Talking:** the speaking host (from `src/lines.json`) bobs slightly, mouth opens on each word's span, and gets a
  rim light in their colour; the other host dims to 70% and nods occasionally.
- **Chat bubbles:** each point pops in above its speaker (spring, scale 0.6 → 1 with a tail pointing at them), in
  their colour, 4-8 words of the point in bold. Older bubbles stack up and fade to 40%; keep at most 3 visible.
- **Score:** a small tug-of-war meter under the ON AIR sign that leans toward whoever made the last strong point.

## Beat sheet (35 s, ~80 words over 6-8 lines)
| Time | Beat |
|---|---|
| 0-3 s | Host A asks the question to camera; ON AIR flickers on; title bubble with the question |
| 3-25 s | Alternate points, 2-3 each, every reply answering the last one |
| 25-31 s | Reveal: lights dim, a drumroll-ish `riser.wav`, the meter swings, a "WINNER" banner drops on one host with confetti (`random` particles) |
| 31-35 s | Winner's one-line takeaway + end card |

The winner should follow from the arguments; say why in one sentence.

## Voices and sound
- Two different voices: e.g. Delia for Host A, Adrian for Host B (`lines/01-maya/`, `lines/02-dev/`…). Directions
  per line: `[playful, confident]`, `[skeptical, cutting in]`. Gap 0.2 s so it feels like conversation.
- `pop.wav` on each bubble, `ding.wav` on the winner, `hum.wav` loop at 0.1 for studio room tone.

## Captions
Coloured by speaker (orange / cyan), lower third, 1-3 words per page so they keep up with the back-and-forth.

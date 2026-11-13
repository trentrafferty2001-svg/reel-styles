---
name: reel-desk-explainer
description: Makes a 35 s vertical list reel - N things for an audience - with a character at a desk, one card per item with a number badge and a live mini demo, a cream background, terracotta captions and a dark end card. Use for lists, tools and step-by-step tips, or when the user runs /reel-desk-explainer.
---

# Desk explainer reel

**Starting prompt:** Make a 35-second vertical list reel: [NUMBER] [THINGS] for [AUDIENCE]. A character at a desk,
one card per item with a number badge and a live mini demo, cream background, terracotta captions, dark end card.

Build with the `reel-base` pipeline (load it first).

**3D look:** render it in 3D (reel-base section 7). The reference frame is `previews/desk-explainer.png`; start the world from `previews/v2/scenes/desk-explainer.js`. The colours and layout below still apply; flat-drawing details (outline widths, SVG shapes) translate to 3D materials and lighting.

## Look
- **Palette:** cream background `#f3ead8`, ink `#2b2420`, terracotta `#c8613f` (accent + captions), sage `#8aa58a`
  for "good" ticks, card white `#fffaf1`. Fonts: a rounded sans (Nunito 800) for titles, Inter for UI text.
- **Character at a desk** (bottom third, y 1250-1650, small enough to leave room for captions above): a friendly
  flat character with a laptop and a mug. They glance up at each new card, point at it, type during demos (hands
  bob), and do a small nod when an item lands. Blinks every ~3 s.
- **Cards** float in the upper two thirds (y 360-1150): rounded 36 px, soft shadow, slide up and settle with a spring.
  Top-left a round **number badge** in terracotta (white number, pops with a `pop.wav`). Title in Nunito 800, 64 px.
- **Live mini demo** inside each card: a tiny animated UI that shows the item working, e.g. a toggle switching
  on, a search box typing and filtering results, a progress bar filling, a before/after slider, a list sorting
  itself. Keep demos 2-3 s, driven by `useCurrentFrame()`, and loop if the line runs long.
- **Progress:** a row of N small dots under the title, the current one filled terracotta.

## Beat sheet (35 s, ~80 words; best with 3-5 items)
| Time | Beat |
|---|---|
| 0-3 s | Hook: "[NUMBER] [THINGS] every [AUDIENCE] should know." Title card over the desk |
| 3-30 s | One card per item, equal time; one sentence what it is, one what it does for you, while its demo plays |
| 30-35 s | **Dark end card:** background switches to `#1f1a17`, cream text, recap of the N item names in a column, CTA |

## Voice and sound
- One warm voice (Adrian or Delia, speed 1.15, `[friendly, like a coworker showing you a trick]`).
- `pop.wav` per badge, `type.wav` bursts during typing demos, `click.wav` for toggles, `ding.wav` on the recap.

## Captions
Terracotta `#c8613f`, Nunito 800 60 px, current word ink-coloured, sitting just above the desk (y≈1180). 3-5 words.

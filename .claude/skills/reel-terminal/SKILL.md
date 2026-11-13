---
name: reel-terminal
description: Makes a 35 s vertical terminal-style reel - a dark code window typing commands, each result as a card with the old price struck through and the new price counting down, a running total and the final saving in big green type. Use for tech, free tools and money-saved content, or when the user runs /reel-terminal.
---

# Terminal reel

**Starting prompt:** Make a 35-second vertical terminal reel about [TOPIC]. A dark code window typing commands, each
result as a card with old price struck through and new price counting down, a running total, the final saving in
big green type.

Build with the `reel-base` pipeline (load it first).

## Look
- **Background:** near-black `#0b0d10` with a faint dot grid (`#1a1f26`) and a soft green glow behind the window.
- **Terminal window** (x 60-1020, y 300-1000): rounded 24 px, `#12161c`, title bar with three dots (red/amber/green)
  and a title like `~/save-money — zsh`. Monospace font JetBrains Mono (save to `public/fonts`), 34 px, text `#d6e2ee`,
  prompt `$` in green `#3ddc84`, flags in cyan `#5cc8ff`, strings in amber `#ffcc66`.
- **Typing:** commands type character by character (~2 chars per frame, with tiny `random(seed)` hesitations) and a
  block cursor that blinks every 15 frames when idle. Output lines appear instantly after a 6-frame "think".
- **Result cards** slide up below the window (y 1040-1300), one per command: tool/item name, old price in grey
  `#7d8590` with a red strike line that draws across, new price counting **down** from old to new over ~20 frames
  in green, and a small "FREE" or "-82%" pill.
- **Running total** pinned top right of the window: "Saved: $0" counting up each time a card lands, with a tiny
  bump.
- **Finale:** the window shrinks away, the total grows into huge green type (Inter 900, 220 px, `#3ddc84`, glow) —
  "$1,284 / year" — with a line underneath saying what it adds up from.

## Beat sheet (35 s, ~80 words)
| Time | Beat |
|---|---|
| 0-3 s | Hook: the big claim ("You're paying for things that are free") while the first command starts typing |
| 3-28 s | 3-5 commands, each = one tool or swap: command → output → card → total bumps |
| 28-33 s | Final saving in big green type |
| 33-35 s | End card (terminal-style: `$ follow --for-more` with blinking cursor) |

Prices must be real and current: check them (WebSearch) and note sources in `plan.md`. Commands should look
plausible but can be illustrative; don't show anything that would be harmful to run.

## Voice and sound
- One crisp voice (Adrian, speed 1.15-1.2, `[confident, quick, a little smug]`).
- `type.wav` per typed character group (every 2-3 frames while typing, volume 0.25), `click.wav` on Enter,
  `tick.wav` during countdowns, `ding.wav` on the final saving.

## Captions
Monospace (JetBrains Mono 700, 54 px), green current word on white text, centred around y≈1450, 3-4 words.

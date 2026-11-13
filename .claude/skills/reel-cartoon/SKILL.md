---
name: reel-cartoon
description: Makes a 35 s vertical cartoon reel that explains a concept with a little mascot - bold flat colours, a big number or meter as the hook, the mascot reacting to each step and punchy sound effects. Use for funny problems, metaphors and simple concepts, or when the user runs /reel-cartoon.
---

# Cartoon mascot reel

**Starting prompt:** Make a 35-second vertical cartoon reel that explains [CONCEPT] with a little mascot. Bold flat
colours, a big number or meter as the hook, the mascot reacting to each step, punchy sound effects.

Build with the `reel-base` pipeline (load it first).

## Look
- **Palette:** bold and flat, no gradients except a soft one on the sky. Background sunny yellow `#ffd23f` or sky
  `#5ec8ff` (pick one per video), with shapes in tomato `#ff5a4e`, grass `#3ec46d`, grape `#7b5cff`, white, and ink
  outlines `#1d1d1d` at 8 px everywhere.
- **Mascot:** one original character designed for the concept (e.g. a little battery for energy, a droplet for
  water, a coin for money). Big round body, huge eyes with pupils that track what matters, small limbs, no more
  than 3 colours. Build it as one component with props: `mood` (happy, shocked, worried, smug, dizzy), `look`
  (angle), `squash` (0-1). Every reaction uses squash-and-stretch on a spring.
- **The hook:** a giant number or meter in the first second: a number slamming in at 260 px with a shake, or a
  gauge whose needle swings into the red. Return to it at the end with its final value.
- **Steps:** each step is a simple visual gag around the mascot (a prop drops in, the mascot gets bigger/smaller,
  a thought bubble shows the idea). Mascot reacts to every step: mood change + a pop.
- **Transitions:** quick iris wipes or a whip pan (translateX 1200 px in 6 frames with motion blur via a few
  offset translucent copies).

## Beat sheet (35 s, ~80 words)
| Time | Beat |
|---|---|
| 0-3 s | Big number / meter hook + mascot shocked |
| 3-28 s | 3-4 steps that build the concept; one gag each; mascot reacts |
| 28-33 s | Payoff: meter or number lands on its final value; mascot happy, little confetti |
| 33-35 s | End card with the mascot waving |

## Voice and sound
- One energetic voice (Delia or Sheila, speed 1.15-1.2, `[playful, cartoon narrator]`).
- Punchy SFX on almost every move: `boing.wav` for squash, `pop.wav` for props, `whoosh.wav` for whip pans,
  `thud.wav` for the number slam, `ding.wav` for the payoff.

## Captions
Chunky: Nunito 900 or Fredoka, 84 px, white with an 8 px ink outline (`WebkitTextStroke` or `paintOrder: stroke`),
current word in the tomato colour, 1-2 words per page, each page popping in with a small scale bounce.

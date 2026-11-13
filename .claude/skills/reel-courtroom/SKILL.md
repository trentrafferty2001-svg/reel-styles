---
name: reel-courtroom
description: Makes a 35 s vertical courtroom reel that puts an idea, myth or decision on trial - a judge, one character for and one against, 12 jurors voting in secret, a gavel, the verdict and one fix as the ending. Use for testing ideas, myths and decisions, or when the user runs /reel-courtroom.
---

# Courtroom reel

**Starting prompt:** Make a 35-second vertical courtroom reel that puts [IDEA] on trial. A judge, one character for
and one against, 12 jurors voting guilty or not guilty in secret, gavel sound, the verdict and one fix as the ending.

Build with the `reel-base` pipeline (load it first), using its **several voices** path.

**3D look:** render it in 3D (reel-base section 7). The reference frame is `previews/courtroom.png`; start the world from `previews/v2/scenes/courtroom.js`. The colours and layout below still apply; flat-drawing details (outline widths, SVG shapes) translate to 3D materials and lighting.

## Look
- **Courtroom:** warm wood panelling (`#5a3a22`, `#7a5232` stripes), cream wall above (`#efe4cf`), a raised bench
  centre top with the **judge** (black robe, white collar, grey hair shape, round glasses) and a brass nameplate
  "THE COURT". A seal behind them with the idea's icon.
- **Two counsel** at podiums lower left and right: **For** in blue `#3b6fd8`, **Against** in red `#d84a3b`, each with
  a sign on the podium. Flat vector, thick 6 px outlines `#2a1a10`.
- **The charge:** opens on a case-file card sliding up: "THE PEOPLE vs. [IDEA]" in a slab serif (Roboto Slab), case
  number, a red "ON TRIAL" stamp that slams on with a `thud.wav`.
- **Evidence cards:** each argument appears as an "EXHIBIT A/B/C" card in the speaker's colour, tilted ±3°.
- **Jury box:** 12 small juror heads in two rows of 6 along one side. During deliberation each juror's ballot flips
  face down in sequence (secret); at the verdict they all flip at once to show GUILTY (red) or NOT GUILTY (green),
  then a tally counts up ("9 – 3").
- **Camera:** gentle cuts between wide, judge close-up and counsel close-up, driven by who speaks in `src/lines.json`
  (zoom the whole courtroom group with `scale`/`translate`, 8-frame eased moves).

## Beat sheet (35 s, ~80 words)
| Time | Beat |
|---|---|
| 0-3 s | Judge reads the charge; gavel; ON TRIAL stamp |
| 3-20 s | For / Against alternate, 2 exhibits each, short and specific |
| 20-25 s | "The jury will now decide." Secret ballots flip one by one with `tick.wav` |
| 25-30 s | Verdict: ballots reveal, tally, judge's gavel (`gavel.wav` twice), verdict banner |
| 30-35 s | The one fix ("The court orders…") on a sentencing card + end card |

## Voices and sound
- Judge: Adrian, `[stern, measured judge]`, speed 1.05. For: Delia `[earnest]`. Against: Sheila `[sharp, skeptical]`.
- `gavel.wav` on the charge and the verdict, `whoosh.wav` on exhibits, `tick.wav` per ballot, `hum.wav` at 0.1.

## Captions
Lower third in the speaker's colour (judge = cream with dark outline), 2-4 words per page.

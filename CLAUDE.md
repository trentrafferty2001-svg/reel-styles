# Reel Styles

This repo holds eight reel art styles as skills (`.claude/skills/reel-*`). Each style skill builds on
`reel-base`: load both when making a reel.

- Free providers only unless the user says otherwise. Fish Audio is the only paid call; check credit before
  recording and don't re-take lines without reason.
- Videos go in `videos/<slug>/`. Commit the project, script, plan and final MP4; never `node_modules` or stills.
- When a reel is rendered, send the MP4 to the user with SendUserFile (they watch on their phone).
- Captions: no em dashes, no "it's not X, it's Y" reveals, no engagement bait beyond the style's own ending
  (the save-this card, the comment-keyword pill).
- Characters, mascots and sets are original designs; don't recreate existing shows, brands or characters.

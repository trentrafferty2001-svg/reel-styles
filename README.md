# Reel Styles

Eight vertical reel art styles (1080×1920, ~35 s), each as a Claude Code skill that writes the script, plans the
scenes, records the voice with Fish Audio, animates everything in code with Remotion, adds captions and sound
effects, and renders the MP4. All visuals are made in code, so there are no paid image or video generators.

| # | Style | Skill | Good for |
|---|---|---|---|
| 01 | Documentary | `/reel-documentary` | Big topics, history, explainers that feel like a film |
| 02 | Podcast | `/reel-podcast` | Debates, opinions, two sides of a question |
| 03 | Courtroom | `/reel-courtroom` | Testing ideas, myths, decisions |
| 04 | Poster styles | `/reel-poster-styles` | Designers, before/after, variety posts |
| 05 | Desk explainer | `/reel-desk-explainer` | Lists, tools, step-by-step tips |
| 06 | Cartoon | `/reel-cartoon` | Funny problems, metaphors, simple concepts |
| 07 | Terminal | `/reel-terminal` | Tech, free tools, money saved |
| 08 | Night desk | `/reel-night-desk` | Stories, tutorials, how-it's-made |

## Use
In a Claude Code session on this repo, run a style with your topic, e.g.

```
/reel-courtroom "Multitasking makes you more productive"
/reel-desk-explainer 5 free AI tools for students
/reel-terminal subscriptions you can replace with free tools
```

The fill-in-the-blanks prompt for each style is in [`prompts.md`](prompts.md).

## Layout
- `.claude/skills/reel-base/`: the shared pipeline (project setup, voice, multi-voice stitching, captions, sound
  effects, checks). Every style loads it.
- `.claude/skills/reel-<style>/SKILL.md`: the look, beat sheet, voices and sounds for that style.
- `videos/<slug>/`: each reel's Remotion project, script, plan and final MP4.

## Needs
Node 20+, FFmpeg, and a Fish Audio key (in cloud sessions it's a network secret, used as `FISH_API_KEY=proxy-injected`).

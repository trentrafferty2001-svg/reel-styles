#!/usr/bin/env bash
# Prepares a fresh Remotion project so rendering needs no downloads at render time.
#
#   setup-project.sh videos/<slug>
#
# 1. Saves Inter (variable font, latin) to public/fonts/inter-latin.woff2; src/theme.ts loads it from there.
#    Rendering then never fetches Google Fonts, which fails in sandboxes whose HTTPS proxy Chrome doesn't trust.
# 2. If a headless Chromium is pre-installed (e.g. Claude Code cloud sessions), points remotion.config.ts at it,
#    so Remotion doesn't try to download its own browser.
set -euo pipefail
dir="${1:?usage: setup-project.sh videos/<slug>}"
[ -f "$dir/remotion.config.ts" ] || { echo "no remotion.config.ts in $dir: run create-video first" >&2; exit 1; }

mkdir -p "$dir/public/fonts"
font="$dir/public/fonts/inter-latin.woff2"
if [ ! -s "$font" ]; then
  css=$(curl -fsSL -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36" \
    "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=block")
  url=$(printf '%s\n' "$css" | awk '/\/\* latin \*\//{f=1} f && /src: url/{match($0, /https:[^)]+/); print substr($0, RSTART, RLENGTH); exit}')
  [ -n "$url" ] || { echo "could not find the Inter latin font URL" >&2; exit 1; }
  curl -fsSL -o "$font" "$url"
fi
echo "font: $font"

browser=""
for b in /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell; do
  [ -x "$b" ] && browser="$b"
done
if [ -n "$browser" ] && ! grep -q setBrowserExecutable "$dir/remotion.config.ts"; then
  printf '\n// Use the pre-installed headless Chromium instead of downloading one.\nConfig.setBrowserExecutable("%s");\n' \
    "$browser" >> "$dir/remotion.config.ts"
fi
echo "browser: ${browser:-none pre-installed, Remotion downloads one on first render}"

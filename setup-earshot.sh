#!/usr/bin/env bash
# Installs earshot (sound analysis + code-made SFX bank for agents) and its two models (~1.1 GB).
# Safe to re-run. Usage: bash setup-earshot.sh
set -euo pipefail
REV=4ac3d2ac2b151e1c23376f9ce7f3047a17050013  # earshot 0.4.1; bump on purpose, not by default
command -v ffmpeg >/dev/null || { echo "ERROR: ffmpeg is required." >&2; exit 1; }
command -v uv >/dev/null || { echo "ERROR: uv is required." >&2; exit 1; }
command -v earshot >/dev/null || uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@$REV"
earshot doctor --fetch | grep -E '^(models_cached|bank|problems):'

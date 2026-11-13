#!/usr/bin/env bash
# Synthesizes a small library of sound effects with FFmpeg only: free, offline, no licences to check.
#
#   make-sfx.sh videos/<slug>        # writes videos/<slug>/public/sfx/*.wav
#
# whoosh  pop  click  type  ding  thud  gavel  boing  tick  riser  rain (8 s loop)  hum (8 s room tone)
# Play one in Remotion with <Sequence from={f}><Html5Audio src={staticFile("sfx/pop.wav")} volume={0.6} /></Sequence>.
set -euo pipefail
dir="${1:?usage: make-sfx.sh videos/<slug>}"
out="$dir/public/sfx"
mkdir -p "$out"
f() { ffmpeg -y -v error "$@"; }

f -f lavfi -i "anoisesrc=d=0.45:c=pink:a=0.6" -af "highpass=f=300,lowpass=f=3500,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.25,volume=0.9" "$out/whoosh.wav"
f -f lavfi -i "sine=f=880:d=0.09" -af "asetrate=44100*1.0,aeval='val(0)*exp(-t*45)',volume=1.2" "$out/pop.wav"
f -f lavfi -i "anoisesrc=d=0.03:c=white:a=0.8" -af "highpass=f=2000,afade=t=out:d=0.03" "$out/click.wav"
f -f lavfi -i "anoisesrc=d=0.05:c=white:a=0.5" -af "bandpass=f=3000:w=1500,aeval='val(0)*exp(-t*90)'" "$out/type.wav"
f -f lavfi -i "sine=f=1318:d=0.9" -f lavfi -i "sine=f=1975:d=0.9" -filter_complex "amix=inputs=2,aeval='val(0)*exp(-t*5)',volume=1.4" "$out/ding.wav"
f -f lavfi -i "sine=f=70:d=0.35" -af "aeval='val(0)*exp(-t*14)',volume=2" "$out/thud.wav"
f -f lavfi -i "sine=f=140:d=0.4" -f lavfi -i "anoisesrc=d=0.06:c=brown:a=0.9" -filter_complex "[1]lowpass=f=1200[n];[0][n]amix=inputs=2:duration=longest,aeval='val(0)*exp(-t*18)',volume=2.5" "$out/gavel.wav"
f -f lavfi -i "sine=f=300:d=0.4" -af "vibrato=f=18:d=0.8,aeval='val(0)*exp(-t*7)',volume=1.2" "$out/boing.wav"
f -f lavfi -i "sine=f=2200:d=0.02" -af "afade=t=out:d=0.02" "$out/tick.wav"
f -f lavfi -i "anoisesrc=d=1.2:c=pink:a=0.5" -af "highpass=f=200,afade=t=in:d=1.1,volume=0.8" "$out/riser.wav"
f -f lavfi -i "anoisesrc=d=8:c=pink:a=0.25" -af "highpass=f=800,lowpass=f=6000,tremolo=f=9:d=0.3" "$out/rain.wav"
f -f lavfi -i "anoisesrc=d=8:c=brown:a=0.08" -af "lowpass=f=400" "$out/hum.wav"
ls "$out"

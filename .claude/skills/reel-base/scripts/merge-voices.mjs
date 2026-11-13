#!/usr/bin/env node
// Stitch several single-voice takes into one voiceover with speaker-tagged captions.
// For styles with more than one voice (podcast hosts, courtroom judge / prosecutor / defence).
//
// Usage (from the folder that holds videos/):
//   node <base>/scripts/merge-voices.mjs videos/<slug> [--gap 0.25]
//
// Reads   videos/<slug>/lines/<NN>-<speaker>/public/voiceover.mp3 and src/captions.json, in folder order
//         (each made with fish-voiceover.mjs and that speaker's --voice)
// Writes  videos/<slug>/public/voiceover.mp3
//         videos/<slug>/src/captions.json   (each word also gets `speaker` and `line`)
//         videos/<slug>/src/lines.json      ([{ line, speaker, startMs, endMs, text }])
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const dir = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--gap');
if (!dir) {
  console.error('usage: merge-voices.mjs videos/<slug> [--gap 0.25]');
  process.exit(1);
}
const gi = args.indexOf('--gap');
const GAP = gi >= 0 ? Number(args[gi + 1]) : 0.25;
const linesDir = path.join(dir, 'lines');
const parts = fs.readdirSync(linesDir).filter((d) => /^\d+-/.test(d)).sort();
if (!parts.length) {
  console.error(`no lines/<NN>-<speaker>/ folders in ${dir}`);
  process.exit(1);
}

const probe = (f) => {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' });
  return Number(r.stdout.trim());
};

const tmp = path.join(dir, '.merge');
fs.mkdirSync(tmp, { recursive: true });
const silence = path.join(tmp, 'gap.wav');
spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `anullsrc=r=44100:cl=mono`, '-t', String(GAP), silence]);

const list = [];
const captions = [];
const lines = [];
let offsetMs = 0;
parts.forEach((p, idx) => {
  const speaker = p.replace(/^\d+-/, '');
  const mp3 = path.join(linesDir, p, 'public', 'voiceover.mp3');
  const caps = JSON.parse(fs.readFileSync(path.join(linesDir, p, 'src', 'captions.json'), 'utf8'));
  const wav = path.join(tmp, `${p}.wav`);
  spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', mp3, '-ar', '44100', '-ac', '1', wav]);
  const durMs = probe(wav) * 1000;
  for (const c of caps) {
    captions.push({ ...c, startMs: c.startMs + offsetMs, endMs: c.endMs + offsetMs,
      timestampMs: (c.timestampMs ?? c.startMs) + offsetMs, speaker, line: idx });
  }
  lines.push({ line: idx, speaker, startMs: Math.round(offsetMs), endMs: Math.round(offsetMs + durMs),
    text: caps.map((c) => c.text).join('').trim() });
  list.push(`file '${path.resolve(wav)}'`);
  offsetMs += durMs;
  if (idx < parts.length - 1) {
    list.push(`file '${path.resolve(silence)}'`);
    offsetMs += GAP * 1000;
  }
});

const listFile = path.join(tmp, 'list.txt');
fs.writeFileSync(listFile, list.join('\n') + '\n');
fs.mkdirSync(path.join(dir, 'public'), { recursive: true });
fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
const out = path.join(dir, 'public', 'voiceover.mp3');
const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', listFile,
  '-c:a', 'libmp3lame', '-b:a', '192k', out], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
fs.writeFileSync(path.join(dir, 'src', 'captions.json'), JSON.stringify(captions, null, 2));
fs.writeFileSync(path.join(dir, 'src', 'lines.json'), JSON.stringify(lines, null, 2));
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`merged ${parts.length} lines, ${(offsetMs / 1000).toFixed(1)} s -> ${out}`);

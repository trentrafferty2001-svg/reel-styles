import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { C, sans } from "./theme";

type Word = { text: string; startMs: number; endMs: number };
const words = captions as Word[];
// One sentence per page; long sentences split at a comma after 6+ words.
const pages: Word[][] = [];
let page: Word[] = [];
words.forEach((w, i) => {
  page.push(w);
  const t = w.text.trim();
  if (/[.?!]$/.test(t) || i === words.length - 1 || (/,$/.test(t) && page.length >= 6)) { pages.push(page); page = []; }
});

export const Captions: React.FC<{ hideAfterMs: number }> = ({ hideAfterMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  if (ms >= hideAfterMs) return null;
  const k = pages.findIndex((p, i) => ms >= p[0].startMs - 80 && ms < (pages[i + 1]?.[0].startMs ?? Infinity) - 80 && ms < p[p.length - 1].endMs + 700);
  if (k < 0) return null;
  const p = pages[k];
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 330 }}>
      <div style={{ width: 900, textAlign: "center", fontFamily: sans, fontWeight: 600, fontSize: 56, lineHeight: 1.28, color: C.cream,
        textShadow: "0 3px 22px rgba(0,0,0,.9), 0 0 2px rgba(0,0,0,.6)" }}>
        {p.map((w, i) => (
          <span key={i} style={{ opacity: interpolate(ms, [w.startMs - 60, w.startMs + 120], [0.28, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {i === 0 ? w.text.trimStart() : w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

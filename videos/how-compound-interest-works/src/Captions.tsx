import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { C, fontFamily, OUT } from "./theme";

type Word = { text: string; startMs: number; endMs: number };
const words = captions as Word[];
const endsSentence = (w: Word) => /[.?!]["')]*$/.test(w.text.trim());

// 1-2 word pages that never cross a sentence end
const pages: { startMs: number; endMs: number; words: Word[] }[] = [];
let page: Word[] = [];
words.forEach((w, i) => {
  page.push(w);
  let left = 0;
  for (let j = i + 1; j < words.length && !endsSentence(words[j - 1]); j++) left++;
  if (endsSentence(w) || i === words.length - 1 || /[,;:]$/.test(w.text.trim()) || (page.length >= 2 && left !== 1)) {
    pages.push({ startMs: page[0].startMs, endMs: w.endMs, words: page });
    page = [];
  }
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const k = pages.findIndex((p, i) => ms >= p.startMs && ms < Math.min(pages[i + 1]?.startMs ?? Infinity, p.endMs + 400));
  if (k < 0) return null;
  const cur = pages[k];
  const s = spring({ frame: frame - Math.round((cur.startMs / 1000) * fps), fps, config: { damping: 10, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * s})`, fontFamily, fontWeight: 700, fontSize: 84, textAlign: "center",
        WebkitTextStroke: `${OUT * 2}px ${C.ink}`, paintOrder: "stroke fill", maxWidth: 1000, lineHeight: 1.1 }}>
        {cur.words.map((w, i) => (
          <span key={i} style={{ color: ms >= w.startMs && ms < Math.min(cur.words[i + 1]?.startMs ?? Infinity, w.endMs + 150) ? C.tomato : C.white }}>
            {i === 0 ? w.text.trimStart() : w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

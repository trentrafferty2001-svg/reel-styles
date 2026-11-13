import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { fontFamily } from "./theme";

type Word = { text: string; startMs: number; endMs: number };
const words = captions as Word[];
const endsSentence = (w: Word) => /[.?!]["')]*$/.test(w.text.trim());

// Pages of up to 6 words that end at sentence ends (or at a comma once a page has 3 words), never leaving a
// single word alone on a page.
const pages: { startMs: number; endMs: number; words: Word[] }[] = [];
let page: Word[] = [];
words.forEach((w, i) => {
  page.push(w);
  let left = 0; // words left in this sentence after this one
  for (let j = i + 1; j < words.length && !endsSentence(words[j - 1]); j++) left++;
  const clause = /[,;:]["')]*$/.test(w.text.trim()) && page.length >= 3;
  if (endsSentence(w) || i === words.length - 1 || ((page.length >= 6 || clause) && left >= 2)) {
    pages.push({ startMs: page[0].startMs, endMs: w.endMs, words: page });
    page = [];
  }
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  // A page stays up until the next one starts, but clears 0.4 s after its last word during a long pause.
  const current = pages.find((p, k) => ms >= p.startMs && ms < Math.min(pages[k + 1]?.startMs ?? Infinity, p.endMs + 400));
  if (!current) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 420 }}>
      <div style={{ maxWidth: 900, textAlign: "center", fontFamily, fontSize: 64, fontWeight: 800,
        color: "white", textShadow: "0 4px 16px rgba(0,0,0,0.6)", whiteSpace: "pre-wrap" }}>
        {current.words.map((w, i) => (
          <span key={i} style={{ color: ms >= w.startMs && ms < w.endMs ? "#ffd84d" : "white" }}>
            {i === 0 ? w.text.trimStart() : w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

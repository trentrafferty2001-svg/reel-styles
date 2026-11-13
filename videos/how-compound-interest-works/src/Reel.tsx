import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { Captions } from "./Captions";
import { Background, Sfx, Whip } from "./Kit";
import { Bars, EndCard, Hook, Payoff, Rate, Snowball, Trick } from "./Scenes";
import "./theme";

const at = (phrase: string, fps: number) => {
  const target = phrase.toLowerCase().split(/\s+/);
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
  for (let i = 0; i < captions.length; i++)
    if (target.every((w, j) => clean(captions[i + j]?.text ?? "") === clean(w))) return Math.round((captions[i].startMs / 1000) * fps);
  throw new Error(`phrase not found in captions: ${phrase}`);
};

export const Reel: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const a = (p: string) => at(p, fps);
  const starts = [0, a("Say it earns"), a("Here's the trick"), a("And the babies"), a("Without compounding"), a("The secret ingredient"), a("Follow for more")];
  starts.forEach((s, i) => {
    if (i > 0 && s <= starts[i - 1]) throw new Error(`scene ${i + 1} starts before scene ${i}`);
  });
  const len = (i: number) => (starts[i + 1] ?? durationInFrames) - starts[i];
  const rel = (p: string, i: number) => a(p) - starts[i];
  const scenes = [
    <Hook h={{ years: rel("forty years", 0), grow: rel("turns into", 0) + 4, how: rel("How", 0) }} />,
    <Rate h={{ rate: rel("eight percent", 1), eighty: rel("eighty dollars", 1) }} />,
    <Trick h={{ earns: rel("earns interest too", 2), baby: rel("baby money", 2) }} />,
    <Snowball h={{ babies: rel("make babies", 3), pile: rel("A bigger pile", 3), faster: rel("faster", 3), every: rel("every year", 3) }} />,
    <Bars h={{ four: rel("four thousand", 4), over: rel("over twenty-one", 4) }} />,
    <Payoff h={{ time: rel("is time", 5), early: rel("Start early", 5) }} />,
    <EndCard />,
  ];
  return (
    <AbsoluteFill>
      <Background />
      <Html5Audio src={staticFile("voiceover.mp3")} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={len(i)}>
          <Whip enabled={i > 0}>{s}</Whip>
        </Sequence>
      ))}
      {starts.slice(1).map((s, i) => <Sfx key={i} at={s} name="whoosh" volume={0.35} />)}
      <Captions />
    </AbsoluteFill>
  );
};

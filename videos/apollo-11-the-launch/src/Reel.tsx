import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { Captions } from "./Captions";
import { Stage } from "./Stage";
import { C, sans, serif } from "./theme";

const at = (phrase: string, fps: number) => {
  const target = phrase.toLowerCase().split(/\s+/);
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
  for (let i = 0; i < captions.length; i++)
    if (target.every((w, j) => clean(captions[i + j]?.text ?? "") === clean(w))) return Math.round((captions[i].startMs / 1000) * fps);
  throw new Error(`phrase not found in captions: ${phrase}`);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SHOTS = [
  { id: "title", from: "", label: "" },
  { id: "establish", from: "A hot morning", label: "" },
  { id: "machine", from: "Saturn Five", label: "I. The Machine" },
  { id: "crowd", from: "Nearly a million", label: "II. The Crowd" },
  { id: "liftoff", from: "At nine", label: "III. Liftoff" },
  { id: "climb", from: "In under three", label: "IV. The Climb" },
  { id: "moon", from: "Four days later", label: "V. Four Days Later" },
  { id: "end", from: "Follow for more", label: "" },
];

const Chapter: React.FC<{ label: string; small?: string }> = ({ label, small }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 24, 80, 100], [0, 1, 1, 0], clamp);
  const [num, ...rest] = label.split(". ");
  return (
    <div style={{ position: "absolute", left: 80, top: 290, opacity: o, transform: `translateY(${interpolate(f, [8, 30], [12, 0], clamp)}px)` }}>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, letterSpacing: 12, color: C.amber, marginBottom: 14 }}>{small ?? `CHAPTER ${num}`}</div>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: C.cream, textShadow: "0 4px 30px rgba(0,0,0,.6)" }}>{rest.join(". ") || label}</div>
    </div>
  );
};

const TitleCard: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const title = "APOLLO 11";
  const bar = interpolate(f, [10, len - 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, letterSpacing: 14, color: C.amber, opacity: interpolate(f, [4, 18], [0, 1], clamp), marginBottom: 30 }}>A SHORT FILM ABOUT</div>
      <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 150, letterSpacing: 10, color: C.cream }}>
        {title.split("").map((ch, i) => <span key={i} style={{ opacity: interpolate(f, [6 + i * 3, 16 + i * 3], [0, 1], clamp) }}>{ch}</span>)}
      </div>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 54, color: C.cream, opacity: interpolate(f, [30, 44], [0, 0.85], clamp), marginTop: 6 }}>The Launch</div>
      <div style={{ marginTop: 70, width: 600, height: 2, background: "rgba(246,231,200,.18)" }}>
        <div style={{ width: `${bar * 100}%`, height: "100%", background: C.amber, boxShadow: `0 0 10px ${C.amber}` }} />
      </div>
      <div style={{ width: 600, display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: sans, fontSize: 22, letterSpacing: 4, color: "rgba(246,231,200,.6)" }}>
        <span>16 · VII · 1969</span><span>00:36</span>
      </div>
    </AbsoluteFill>
  );
};

const Counters: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [10, len - 15], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const o = interpolate(f, [4, 18], [0, 1], clamp);
  const item = (label: string, value: string) => (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 20, letterSpacing: 8, color: C.amber }}>{label}</div>
      <div style={{ fontFamily: serif, fontSize: 76, color: C.cream, fontVariantNumeric: "tabular-nums", textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>{value}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", right: 80, top: 470, textAlign: "right", opacity: o }}>
      {item("ALTITUDE", `${Math.round(60 * k)} km`)}
      {item("FUEL BURNED", `${Math.round(2000 * k).toLocaleString("en-US")} t`)}
    </div>
  );
};

const HeightMarker: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [20, 110], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <div style={{ position: "absolute", right: 90, top: 520, height: 760, width: 200, opacity: interpolate(f, [14, 26], [0, 1], clamp) }}>
      <div style={{ position: "absolute", right: 0, bottom: 0, width: 2, height: `${k * 100}%`, background: C.cream, boxShadow: "0 0 8px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", right: -10, bottom: `${k * 100}%`, width: 22, height: 2, background: C.cream }} />
      <div style={{ position: "absolute", right: -10, bottom: 0, width: 22, height: 2, background: C.cream }} />
      <div style={{ position: "absolute", right: 30, bottom: `calc(${k * 100}% - 30px)`, textAlign: "right", color: C.cream, textShadow: "0 3px 16px rgba(0,0,0,.8)" }}>
        <div style={{ fontFamily: serif, fontSize: 60 }}>{Math.round(110 * k)} m</div>
        <div style={{ fontFamily: sans, fontSize: 20, letterSpacing: 6, color: C.amber }}>36 STOREYS</div>
      </div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: "center", alignItems: "center", opacity: interpolate(f, [0, 10], [0, 1], clamp) }}>
      <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 90, letterSpacing: 8, color: C.cream }}>APOLLO 11</div>
      <div style={{ marginTop: 50, padding: "18px 48px", border: `2px solid ${C.amber}`, borderRadius: 999, fontFamily: sans, fontWeight: 600, fontSize: 40, letterSpacing: 3, color: C.cream }}>Follow for more</div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const starts = SHOTS.map((s, i) => (i === 0 ? 0 : at(s.from, fps)));
  starts.forEach((s, i) => { if (i > 0 && s <= starts[i - 1]) throw new Error(`shot ${SHOTS[i].id} starts too early`); });
  const len = (i: number) => (starts[i + 1] ?? durationInFrames) - starts[i];
  // 6-frame dip through black at every cut
  const dip = Math.max(0, ...starts.slice(1).map((s) => 1 - Math.abs(frame - s) / 6));
  const bar = interpolate(frame, [starts[1], durationInFrames], [0, 1], clamp);
  const ign = at("five engines", fps) - starts[4];
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Html5Audio src={staticFile("voiceover.mp3")} />
      <Html5Audio src={staticFile("sfx/hum.wav")} loop volume={0.12} />
      <Sequence from={starts[4] + ign - 40} durationInFrames={60}><Html5Audio src={staticFile("sfx/riser.wav")} volume={0.35} /></Sequence>
      <Sequence from={starts[4] + ign}><Html5Audio src={staticFile("sfx/rumble.wav")} volume={0.9} /></Sequence>
      <Sequence from={starts[4] + ign} durationInFrames={30}><Html5Audio src={staticFile("sfx/thud.wav")} volume={0.8} /></Sequence>
      <Sequence from={starts[7]} durationInFrames={40}><Html5Audio src={staticFile("sfx/thud.wav")} volume={0.4} /></Sequence>
      {/* earshot pro_impact/deep, peak 0.213 s: lands on the end card */}
      <Sequence from={starts[SHOTS.length - 1] - Math.round(0.213 * fps)} durationInFrames={45}><Html5Audio src={staticFile("sfx/end.wav")} volume={0.9} /></Sequence>
      {SHOTS.map((s, i) => {
        if (s.id === "title" || s.id === "end") return null;
        return (
          <Sequence key={s.id} from={starts[i]} durationInFrames={len(i)}>
            <Shot id={s.id} start={starts[i]} label={s.label} len={len(i)} />
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={len(0)}><TitleCard len={len(0)} /></Sequence>
      <Sequence from={starts[7]}><EndCard /></Sequence>
      {frame >= starts[1] && frame < starts[7] && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 5, background: "rgba(246,231,200,.15)" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: C.amber, boxShadow: `0 0 12px ${C.amber}` }} />
        </div>
      )}
      <Captions hideAfterMs={(starts[7] / fps) * 1000} />
      <AbsoluteFill style={{ background: "#000", opacity: dip }} />
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ id: string; start: number; label: string; len: number }> = ({ id, start, label, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  void start;
  return (
    <AbsoluteFill>
      <Stage shot={id} t={f / fps} />
      {id === "establish" && <Chapter label="Florida" small="KENNEDY SPACE CENTER" />}
      {label && <Chapter label={label} />}
      {id === "machine" && <HeightMarker />}
      {id === "climb" && <Counters len={len} />}
    </AbsoluteFill>
  );
};

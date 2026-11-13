import { random, useCurrentFrame } from "remotion";
import { C, OUT } from "./theme";

export type Mood = "happy" | "shocked" | "worried" | "smug" | "dizzy";

// Coinny: an original round coin mascot. Draw at (x, y) = centre of the body on the 1080x1920 canvas.
export const Coin: React.FC<{
  x: number;
  y: number;
  size?: number; // body diameter
  mood?: Mood;
  look?: [number, number]; // pupil direction, -1..1
  squash?: number; // -1 (stretch tall) .. 1 (squash flat)
  wave?: boolean;
  seed?: number;
  baby?: boolean;
}> = ({ x, y, size = 360, mood = "happy", look = [0, 0], squash = 0, wave = false, seed = 1, baby = false }) => {
  const frame = useCurrentFrame();
  // Blink for 4 frames every ~90 frames, offset per seed
  const period = 84 + Math.floor(random(seed) * 30);
  const blink = (frame + Math.floor(random(seed + 1) * period)) % period < 4 && mood !== "shocked";
  const sx = 1 + squash * 0.18;
  const sy = 1 - squash * 0.18;
  const r = 100;
  const eyeR = mood === "shocked" ? 30 : 26;
  const px = look[0] * 9;
  const py = look[1] * 9;
  const bob = Math.sin(frame / 9 + seed) * 6;
  const armAngle = wave ? Math.sin(frame / 4) * 35 - 30 : mood === "shocked" ? -60 : 20;

  const eye = (cx: number) => {
    if (blink) return <path d={`M${cx - 22} -18 Q${cx} -8 ${cx + 22} -18`} stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />;
    if (mood === "dizzy") {
      const a = frame * 12;
      return (
        <g transform={`translate(${cx} -18) rotate(${a})`}>
          <circle r={eyeR} fill={C.white} stroke={C.ink} strokeWidth={6} />
          <path d="M0 0 m-14 0 a14 14 0 1 1 14 14 a8 8 0 1 1 -8 -8" stroke={C.ink} strokeWidth={5} fill="none" />
        </g>
      );
    }
    return (
      <g>
        <ellipse cx={cx} cy={-18} rx={eyeR} ry={eyeR * (mood === "smug" ? 0.7 : 1.1)} fill={C.white} stroke={C.ink} strokeWidth={6} />
        <circle cx={cx + px} cy={-16 + py + (mood === "smug" ? 4 : 0)} r={mood === "shocked" ? 9 : 12} fill={C.ink} />
        <circle cx={cx + px + 4} cy={-20 + py} r={3.5} fill={C.white} />
        {mood === "smug" && <path d={`M${cx - 28} -30 L${cx + 28} -26`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />}
        {mood === "worried" && <path d={`M${cx - 22} -54 L${cx + 18} ${cx < 0 ? -46 : -62}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />}
      </g>
    );
  };

  const mouth = {
    happy: <path d="M-34 30 Q0 72 34 30 Z" fill={C.tomato} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />,
    shocked: <ellipse cx={0} cy={44} rx={20} ry={26} fill={C.ink} />,
    worried: <path d="M-26 50 Q0 30 26 50" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />,
    smug: <path d="M-24 40 Q10 58 34 32" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />,
    dizzy: <path d="M-30 44 q10 -12 20 0 q10 12 20 0 q10 -12 20 0" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />,
  }[mood];

  return (
    <svg
      style={{ position: "absolute", left: x - size, top: y - size, width: size * 2, height: size * 2, overflow: "visible" }}
      viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`}
    >
      <g transform={`translate(0 ${bob + 138}) scale(${sx} ${sy}) translate(0 -138)`}>
        <g>
          {/* legs */}
          <path d="M-36 96 L-42 138 L-66 138" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 96 L42 138 L66 138" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* arms */}
          <g transform={`translate(-96 10) rotate(${-armAngle})`}>
            <path d="M0 0 L-50 0" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
            <circle cx={-56} cy={0} r={13} fill={C.white} stroke={C.ink} strokeWidth={6} />
          </g>
          <g transform={`translate(96 10) rotate(${wave ? 0 : armAngle})`}>
            <path d="M0 0 L50 0" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
            <circle cx={56} cy={0} r={13} fill={C.white} stroke={C.ink} strokeWidth={6} />
          </g>
          {/* body: rim + face */}
          <circle r={r} fill={C.goldDark} stroke={C.ink} strokeWidth={OUT} />
          <circle r={r - 16} fill={C.gold} stroke={C.ink} strokeWidth={4} />
          <path d="M-58 -52 A70 70 0 0 1 -14 -76" stroke={C.white} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.8} />
          {baby && (
            <g>
              <path d="M-40 -96 Q0 -132 40 -96" fill={C.tomato} stroke={C.ink} strokeWidth={6} />
              <circle cx={0} cy={-120} r={9} fill={C.white} stroke={C.ink} strokeWidth={5} />
            </g>
          )}
          {eye(-34)}
          {eye(34)}
          {mood !== "dizzy" && mood !== "shocked" && (
            <>
              <ellipse cx={-62} cy={22} rx={14} ry={9} fill={C.tomato} opacity={0.55} />
              <ellipse cx={62} cy={22} rx={14} ry={9} fill={C.tomato} opacity={0.55} />
            </>
          )}
          {mouth}
        </g>
      </g>
    </svg>
  );
};

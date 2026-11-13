import { AbsoluteFill, Easing, Html5Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily, OUT } from "./theme";

export const pop = (frame: number, fps: number, at = 0, damping = 9) =>
  spring({ frame: frame - at, fps, config: { damping, stiffness: 180 } });

// Squash value that kicks on a hit and wobbles back to 0
export const squashAt = (frame: number, fps: number, hits: number[]) => {
  let v = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t >= 0 && t < 30) v += Math.exp(-t / 6) * Math.cos(t / 2.2) * 0.9;
  }
  return Math.max(-1, Math.min(1, v));
};

export const Outlined: React.FC<{ children: React.ReactNode; size: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({
  children, size, color = C.white, stroke = OUT * 2, style,
}) => (
  <div style={{ fontFamily, fontWeight: 700, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${stroke}px ${C.ink}`,
    paintOrder: "stroke fill", letterSpacing: -2, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; bg?: string; style?: React.CSSProperties }> = ({ children, bg = C.white, style }) => (
  <div style={{ background: bg, border: `${OUT}px solid ${C.ink}`, borderRadius: 40, boxShadow: `0 12px 0 ${C.ink}`, padding: "24px 40px", ...style }}>
    {children}
  </div>
);

export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.55 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none">
    <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

// Whip pan: the scene slides in from the right over 6 frames with a streaky blur
export const Whip: React.FC<{ children: React.ReactNode; enabled?: boolean }> = ({ children, enabled = true }) => {
  const frame = useCurrentFrame();
  const t = enabled ? interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  return (
    <AbsoluteFill>
      {t > 0.02 &&
        [0.5, 0.3].map((o, i) => (
          <AbsoluteFill key={i} style={{ transform: `translateX(${t * 1200 + (i + 1) * 90 * t}px)`, opacity: o * t, filter: "blur(8px)" }}>
            {children}
          </AbsoluteFill>
        ))}
      <AbsoluteFill style={{ transform: `translateX(${t * 1200}px)`, filter: t > 0.02 ? `blur(${t * 10}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Confetti: React.FC<{ at: number; n?: number }> = ({ at, n = 70 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const colors = [C.tomato, C.grass, C.grape, C.gold, C.white];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const sp = 18 + random(`s${i}`) * 26;
        const x = 540 + Math.cos(ang) * sp * t;
        const y = 760 + Math.sin(ang) * sp * t * 0.8 + 0.9 * t * t;
        const rot = t * (random(`r${i}`) * 20 - 10);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 34, background: colors[i % colors.length],
            border: `4px solid ${C.ink}`, borderRadius: 6, transform: `rotate(${rot}deg)` }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${C.skyTop}, ${C.sky} 60%)` }}>
      {[0, 1, 2].map((i) => {
        const x = ((i * 430 + frame * (0.6 + i * 0.25)) % 1500) - 300;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 230 + i * 170, width: 240, height: 80, background: C.white,
            borderRadius: 60, opacity: 0.85, boxShadow: `60px -30px 0 10px ${C.white}, -50px -16px 0 0 ${C.white}` }} />
        );
      })}
      <svg style={{ position: "absolute", left: 0, top: 1380, width: 1080, height: 540 }} viewBox="0 0 1080 540">
        <path d="M-20 90 Q540 -40 1100 90 L1100 560 L-20 560 Z" fill={C.grass} stroke={C.ink} strokeWidth={OUT} />
      </svg>
    </AbsoluteFill>
  );
};

export const useFps = () => useVideoConfig().fps;

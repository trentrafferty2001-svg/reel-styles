import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Coin } from "./Coin";
import { Card, Confetti, Outlined, pop, Sfx, squashAt } from "./Kit";
import { C, fontFamily, OUT } from "./theme";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type H = Record<string, number>;

// 1. Hook: $1,000 slams in, 40 YEARS stamp, rolls up to $21,725
export const Hook: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = pop(f, fps, 2, 8);
  const shake = f > 2 && f < 16 ? Math.sin(f * 3) * (16 - f) * 1.4 : 0;
  const roll = interpolate(f, [h.grow, h.grow + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const value = 1000 + (21725 - 1000) * roll;
  const stamp = pop(f, fps, h.years, 7);
  const mood = f >= h.grow ? "shocked" : "happy";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 470, width: "100%", display: "flex", justifyContent: "center",
        transform: `translate(${shake}px, ${shake * 0.4}px) scale(${(0.3 + 0.7 * slam) * (1 + 0.08 * Math.sin(roll * Math.PI))})` }}>
        <Outlined size={roll > 0.5 ? 230 : 260} color={roll > 0 ? C.grass : C.gold}>{money(value)}</Outlined>
      </div>
      <div style={{ position: "absolute", top: 790, width: "100%", display: "flex", justifyContent: "center",
        transform: `rotate(-6deg) scale(${f >= h.years ? 2.2 - 1.2 * stamp : 0})` }}>
        <Card bg={C.tomato} style={{ padding: "14px 40px" }}>
          <Outlined size={84} stroke={10}>40 YEARS</Outlined>
        </Card>
      </div>
      <Coin x={540} y={1240} size={300} mood={mood} look={[0, -1]} squash={squashAt(f, fps, [2, h.grow, h.how])} />
      <Sfx at={2} name="thud" volume={0.9} />
      <Sfx at={h.years} name="thud" volume={0.6} />
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={i} at={h.grow + i * 3} name="tick" volume={0.4} />)}
      <Sfx at={h.how} name="boing" />
    </AbsoluteFill>
  );
};

// 2. 8% a year: sign drops, an $80 baby coin pops out
export const Rate: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sign = pop(f, fps, h.rate, 10);
  const baby = pop(f, fps, h.eighty, 8);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: interpolate(sign, [0, 1], [-400, 420]), width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(${Math.sin(f / 8) * 3}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Card bg={C.grape} style={{ padding: "20px 60px", textAlign: "center" }}>
            <Outlined size={200} stroke={14}>8%</Outlined>
            <Outlined size={64} stroke={10} style={{ marginTop: 6 }}>PER YEAR</Outlined>
          </Card>
        </div>
      </div>
      <Coin x={400} y={1230} size={300} mood={f >= h.eighty ? "happy" : "smug"} look={[0.8, -0.3]} squash={squashAt(f, fps, [h.eighty])} seed={2} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${interpolate(baby, [0, 1], [400, 760])}px, ${1230 - 260 * Math.sin(Math.min(1, baby) * Math.PI) - 0 }px)` }}>
        <div style={{ transform: `scale(${baby})`, position: "relative" }}>
          <Coin x={0} y={40} size={150} mood="happy" look={[-1, 0]} seed={7} baby />
          <div style={{ position: "absolute", left: -90, top: -230 }}>
            <Outlined size={90} color={C.grass}>+$80</Outlined>
          </div>
        </div>
      </div>
      <Sfx at={h.rate} name="whoosh" volume={0.4} />
      <Sfx at={h.rate + 8} name="thud" volume={0.6} />
      <Sfx at={h.eighty} name="pop" volume={0.8} />
      <Sfx at={h.eighty + 4} name="boing" volume={0.5} />
    </AbsoluteFill>
  );
};

// 3. The trick: the $80 earns too and has its own baby
export const Trick: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grand = pop(f, fps, h.earns, 8);
  const title = pop(f, fps, h.baby, 7);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 380, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${pop(f, fps, 0, 12)})` }}>
        <Card bg={C.gold} style={{ padding: "16px 44px" }}>
          <Outlined size={78} stroke={10}>THE TRICK</Outlined>
        </Card>
      </div>
      <Coin x={300} y={1230} size={300} mood="smug" look={[1, 0]} seed={3} squash={squashAt(f, fps, [h.baby])} />
      <Coin x={720} y={1170} size={190} mood={f >= h.earns ? "shocked" : "happy"} look={[0.6, -0.6]} seed={8} baby squash={squashAt(f, fps, [h.earns])} />
      {f >= h.earns && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${880}px, ${1060 - 140 * grand}px) scale(${grand})` }}>
          <Coin x={0} y={0} size={100} mood="happy" look={[-1, 0.5]} seed={11} baby />
          <div style={{ position: "absolute", left: -110, top: -150 }}>
            <Outlined size={64} color={C.grass} stroke={12}>+$6.40</Outlined>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", top: 540, width: "100%", display: "flex", justifyContent: "center",
        transform: `scale(${title}) rotate(${Math.sin(f / 5) * 4}deg)` }}>
        {f >= h.baby && <Outlined size={112} color={C.tomato}>BABY MONEY</Outlined>}
      </div>
      <Sfx at={h.earns} name="pop" volume={0.8} />
      <Sfx at={h.baby} name="boing" volume={0.6} />
      <Sfx at={h.baby + 2} name="pop" />
    </AbsoluteFill>
  );
};

// 4. Babies make babies: coin pile multiplies and a curve bends up
const PILE: [number, number][] = [];
for (let row = 0; row < 7; row++) for (let col = 0; col < 7 - (row % 2); col++) PILE.push([150 + col * 130 + (row % 2) * 65, 1080 - row * 95]);
export const Snowball: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const waves = [h.babies, h.babies + 10, h.pile, h.pile + 8, h.faster, h.faster + 6, h.every];
  const shown = (i: number) => waves[Math.min(waves.length - 1, Math.floor(Math.log2(i + 1)))];
  const draw = interpolate(f, [h.pile, h.every + 20], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
        <path d="M120 1080 C 500 1060, 800 900, 960 360" pathLength={1} strokeDasharray={1} strokeDashoffset={draw}
          stroke={C.white} strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d="M120 1080 C 500 1060, 800 900, 960 360" pathLength={1} strokeDasharray={1} strokeDashoffset={draw}
          stroke={C.tomato} strokeWidth={16} fill="none" strokeLinecap="round" />
      </svg>
      {PILE.map(([x, y], i) => {
        const s = pop(f, fps, shown(i) + (i % 4), 9);
        if (f < shown(i)) return null;
        return <Coin key={i} x={x} y={y} size={80 * s} mood="happy" look={[0, -1]} seed={20 + i} baby={i % 3 === 0} />;
      })}
      <Coin x={540} y={1270} size={260} mood={f >= h.faster ? "dizzy" : "shocked"} look={[0.6, -1]} seed={4} squash={squashAt(f, fps, waves)} />
      {waves.map((w, i) => <Sfx key={i} at={w} name="pop" volume={0.45 + i * 0.05} />)}
      <Sfx at={h.faster} name="boing" volume={0.5} />
    </AbsoluteFill>
  );
};

// 5. Simple vs compound bars
export const Bars: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = 1120;
  const simple = interpolate(f, [h.four, h.four + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const comp = interpolate(f, [h.over, h.over + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const H = 700;
  const bar = (x: number, frac: number, color: string, label: string, value: string, shown: number) => (
    <>
      <div style={{ position: "absolute", left: x, top: base - H * frac * shown, width: 260, height: H * frac * shown, background: color,
        border: `${OUT}px solid ${C.ink}`, borderRadius: "28px 28px 0 0", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: x - 60, width: 380, top: base - H * frac * shown - 120, display: "flex", justifyContent: "center", opacity: shown > 0.05 ? 1 : 0 }}>
        <Outlined size={96}>{value}</Outlined>
      </div>
      <div style={{ position: "absolute", left: x - 60, width: 380, top: base + 24, display: "flex", justifyContent: "center" }}>
        <Outlined size={56} stroke={10}>{label}</Outlined>
      </div>
    </>
  );
  return (
    <AbsoluteFill>
      {bar(140, 4200 / 21725, C.grey, "SIMPLE", "$4,200", simple)}
      {bar(680, 1, C.grass, "COMPOUND", "$21,725", comp)}
      <div style={{ position: "absolute", left: 60, right: 60, top: base, height: OUT, background: C.ink }} />
      <Coin x={540} y={1250} size={160} mood={f >= h.over ? "shocked" : "worried"} look={f >= h.over ? [1, -1] : [-1, -0.6]} seed={5}
        squash={squashAt(f, fps, [h.four, h.over])} />
      <Sfx at={h.four} name="pop" />
      <Sfx at={h.over} name="whoosh" volume={0.6} />
      <Sfx at={h.over + 14} name="thud" volume={0.7} />
    </AbsoluteFill>
  );
};

// 6. Time is the secret: hourglass, then the number lands with confetti
export const Payoff: React.FC<{ h: H }> = ({ h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glass = pop(f, fps, 0, 12);
  const sand = interpolate(f, [0, h.early], [1, 0], clamp);
  const land = pop(f, fps, h.early, 8);
  return (
    <AbsoluteFill>
      <svg style={{ position: "absolute", left: 340, top: 380, width: 400, height: 560, transform: `scale(${glass * (f >= h.early ? Math.max(0, 1 - land) : 1)}) rotate(${Math.sin(f / 10) * 4}deg)`, transformOrigin: "200px 280px" }} viewBox="0 0 400 560">
        <rect x={40} y={10} width={320} height={40} rx={16} fill={C.grape} stroke={C.ink} strokeWidth={OUT} />
        <rect x={40} y={510} width={320} height={40} rx={16} fill={C.grape} stroke={C.ink} strokeWidth={OUT} />
        <path d="M80 50 L320 50 L320 90 Q320 200 210 280 Q320 360 320 470 L320 510 L80 510 L80 470 Q80 360 190 280 Q80 200 80 90 Z" fill="#e8f7ff" stroke={C.ink} strokeWidth={OUT} />
        <path d={`M${200 - 110 * sand} ${250 - 150 * sand} L${200 + 110 * sand} ${250 - 150 * sand} L200 270 Z`} fill={C.gold} />
        <rect x={194} y={270} width={12} height={220} fill={C.gold} opacity={sand > 0 ? 1 : 0} />
        <path d={`M90 505 L310 505 L${200 + 100 * (1 - sand)} ${505 - 150 * (1 - sand)} L${200 - 100 * (1 - sand)} ${505 - 150 * (1 - sand)} Z`} fill={C.gold} />
      </svg>
      <div style={{ position: "absolute", top: 400, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${land})` }}>
        {f >= h.early && <Outlined size={230} color={C.grass}>$21,725</Outlined>}
      </div>
      <div style={{ position: "absolute", top: 260, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${pop(f, fps, h.time, 9)})` }}>
        {f >= h.time && <Card bg={C.tomato} style={{ padding: "12px 36px" }}><Outlined size={72} stroke={10}>TIME</Outlined></Card>}
      </div>
      <Confetti at={h.early} />
      <Coin x={540} y={1250} size={280} mood="happy" look={[0, -1]} seed={6} squash={squashAt(f, fps, [h.time, h.early])} />
      <Sfx at={h.time} name="pop" />
      <Sfx at={h.early} name="ding" volume={0.7} />
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps, 0, 10);
  return (
    <AbsoluteFill style={{ background: C.gold }}>
      <div style={{ position: "absolute", top: 460, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${s})`, gap: 30 }}>
        <Outlined size={120}>Compound</Outlined>
        <Outlined size={120}>interest</Outlined>
        <div style={{ marginTop: 30, background: C.tomato, border: `${OUT}px solid ${C.ink}`, borderRadius: 999, padding: "22px 60px",
          boxShadow: `0 12px 0 ${C.ink}`, fontFamily, fontWeight: 700, fontSize: 64, color: C.white }}>
          Follow for more
        </div>
      </div>
      <Coin x={540} y={1230} size={300} mood="happy" look={[0, 0]} wave seed={9} />
      <Sfx at={0} name="whoosh" volume={0.4} />
    </AbsoluteFill>
  );
};

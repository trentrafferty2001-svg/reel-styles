import { useLayoutEffect, useRef } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { buildWorld } from "./world.js"; // your scene: export async function buildWorld(container) -> { pose(shot, t, frame), canvas }

type World = { pose: (shot: string, t: number, frame: number, opts?: object) => void; canvas: HTMLCanvasElement };
let worldPromise: Promise<World> | null = null;
const getWorld = () => {
  if (!worldPromise) {
    const tmp = document.createElement("div");
    tmp.style.cssText = "position:absolute;left:-99999px";
    document.body.appendChild(tmp);
    worldPromise = buildWorld(tmp);
  }
  return worldPromise!;
};

// Renders the 3D world for one shot; t = seconds since the shot started.
export const Stage: React.FC<{ shot: string; t: number }> = ({ shot, t }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const h = delayRender(`3d ${shot} ${frame}`, { timeoutInMilliseconds: 120000 });
    getWorld()
      .then((w) => {
        if (ref.current && w.canvas.parentElement !== ref.current) {
          w.canvas.style.cssText = "width:100%;height:100%;display:block";
          ref.current.appendChild(w.canvas);
        }
        w.pose(shot, t, frame);
        continueRender(h);
      })
      .catch((e) => { console.error(e); continueRender(h); });
  }, [shot, t, frame]);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
};

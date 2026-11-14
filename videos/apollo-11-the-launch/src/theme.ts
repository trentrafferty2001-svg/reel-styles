import { continueRender, delayRender, staticFile } from "remotion";

export const serif = "Playfair";
export const sans = "Inter";
export const C = { cream: "#f6e7c8", amber: "#e0a24a", ink: "#0c0a08" };

const load = (name: string, file: string, weight: string, style = "normal") => {
  if (typeof document === "undefined") return;
  const h = delayRender(`font ${name}`);
  new FontFace(name, `url(${staticFile(file)}) format("woff2")`, { weight, style })
    .load()
    .then((f) => { document.fonts.add(f); continueRender(h); })
    .catch((e) => { console.error(e); continueRender(h); });
};
load("Inter", "fonts/inter-latin.woff2", "100 900");
load("Playfair", "fonts/playfair.woff2", "400 900");

import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Inter";
if (typeof document !== "undefined" && !document.fonts.check("800 16px Inter")) {
  const handle = delayRender("Loading Inter");
  new FontFace("Inter", `url(${staticFile("fonts/inter-latin.woff2")}) format("woff2")`, { weight: "100 900" })
    .load().then((f) => { document.fonts.add(f); continueRender(handle); })
    .catch((e) => { console.error(e); continueRender(handle); });
}

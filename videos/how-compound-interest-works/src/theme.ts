import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Fredoka";
export const C = {
  sky: "#5ec8ff",
  skyTop: "#8fdcff",
  tomato: "#ff5a4e",
  grass: "#3ec46d",
  grape: "#7b5cff",
  gold: "#ffc83d",
  goldDark: "#e89a12",
  ink: "#1d1d1d",
  white: "#ffffff",
  grey: "#b9c2cc",
};
export const OUT = 8; // ink outline width

const load = (name: string, file: string, weight: string) => {
  if (typeof document === "undefined") return;
  const handle = delayRender(`Loading ${name}`);
  new FontFace(name, `url(${staticFile(file)}) format("woff2")`, { weight })
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
load("Fredoka", "fonts/fredoka-latin.woff2", "300 700");

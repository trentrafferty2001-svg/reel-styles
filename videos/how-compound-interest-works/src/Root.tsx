import { Composition } from "remotion";
import captions from "./captions.json";
import { Reel } from "./Reel";

const FPS = 30;
const lastMs = captions.length ? captions[captions.length - 1].endMs : 3000;

export const RemotionRoot: React.FC = () => (
  <Composition id="Reel" component={Reel} durationInFrames={Math.ceil((lastMs / 1000 + 1.5) * FPS)} fps={FPS} width={1080} height={1920} />
);

// Responsive WebP sources for the JPEG images in src/assets.
//
// Every photo `name.jpg` has resized WebP copies named `name.w<width>.webp`
// beside it. `responsive(src, sizes)` returns `srcSet` + `sizes` props for an
// <img>, so phones download a small WebP while the JPEG stays as `src`.
// If an image has no WebP copies (e.g. a newly added photo), it returns no
// extra props and the <img> simply uses the original JPEG.
//
// When replacing a photo, regenerate its .w*.webp files too (or delete them).

const jpegs = import.meta.glob<string>("/src/assets/**/*.jpg", { eager: true, import: "default" });
const webps = import.meta.glob<string>("/src/assets/**/*.webp", { eager: true, import: "default" });

const srcSets = new Map<string, string>();

for (const [path, url] of Object.entries(jpegs)) {
  const base = path.slice(0, -".jpg".length);
  const entries: [number, string][] = [];
  for (const [webpPath, webpUrl] of Object.entries(webps)) {
    const match = webpPath.startsWith(`${base}.w`) ? /\.w(\d+)\.webp$/.exec(webpPath) : null;
    if (match?.[1]) entries.push([Number(match[1]), webpUrl]);
  }
  if (entries.length) {
    entries.sort((a, b) => a[0] - b[0]);
    srcSets.set(url, entries.map(([w, u]) => `${u} ${w}w`).join(", "));
  }
}

/** Common `sizes` values for the site's layouts. */
export const SIZES = {
  fullBleed: "100vw",
  half: "(min-width: 1024px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  contained: "(min-width: 1280px) 1216px, 100vw",
} as const;

export function responsive(src: string, sizes: string): { srcSet?: string; sizes?: string } {
  const srcSet = srcSets.get(src);
  return srcSet ? { srcSet, sizes } : {};
}

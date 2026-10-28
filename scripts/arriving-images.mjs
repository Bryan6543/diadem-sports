#!/usr/bin/env node
/**
 * Builds the photos for the "Arriving soon" rackets (src/data/arriving-soon.ts) in public/images/arriving/:
 *   - one product shot per racket on a clean white 4:5 card (home page section)
 *   - hero.jpg: the three rackets side by side in a studio backdrop (first home hero slide)
 *
 *   node scripts/arriving-images.mjs
 *
 * Source: Diadem's official product photography on diademsports.com. Photos shot on white or light
 * grey are lifted to pure white and multiplied onto the backdrop, so the strings stay visible.
 * Re-encoding strips EXIF/GPS metadata.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public", "images", "arriving");
const C = "https://cdn.shopify.com/s/files/1/0253/6210/4402/files/";

/** name → official photo; `white` is the background level lifted to pure white (JPGs shot on grey). */
const RACKETS = {
  "elevate-lite-98-v3": { url: `${C}Elevate_front_45.jpg`, white: 250 },
  "elevate-lite-98-v3-teal": { url: `${C}Elevate_V3_Teal_Lite_9971.png` },
  "elevate-v4-team-98": { url: `${C}Elevate_V4_Team_Strings_DDC_5008.jpg`, white: 243 },
};

/** Racket on white, trimmed to the frame. */
async function cutout({ url, white }) {
  const res = await fetch(`${url}?width=2000`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  let img = sharp(Buffer.from(await res.arrayBuffer())).flatten({ background: "#ffffff" });
  if (white) img = img.linear(255 / white, 0);
  const flat = await img.toBuffer();
  return sharp(flat).trim({ background: "#ffffff", threshold: 12 }).toBuffer();
}

const card = (racket) =>
  sharp({ create: { width: 1000, height: 1250, channels: 3, background: "#ffffff" } })
    .composite([{ input: racket, gravity: "center" }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

/** Soft studio light behind the rackets, falling off to the dark left side where the hero text sits. */
const backdrop = (w, h) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="light" cx="0.7" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#f6f8f8"/>
      <stop offset="0.55" stop-color="#dfe7e8"/>
      <stop offset="1" stop-color="#9fb0b2"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#light)"/>
</svg>`);

const shadow = (w, h) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><radialGradient id="s"><stop offset="0" stop-color="#000" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="url(#s)"/>
</svg>`);

async function hero(rackets) {
  const W = 2400;
  const H = 1200;
  // Blue, Teal, Team — kept in the right ~40% (the hero text covers the left); staggered heights.
  const slots = [
    { x: 1500, top: 150, height: 900 },
    { x: 1830, top: 100, height: 950 },
    { x: 2160, top: 150, height: 900 },
  ];
  const layers = [];
  for (const [i, buf] of rackets.entries()) {
    const s = slots[i];
    const r = await sharp(buf).resize({ height: s.height }).toBuffer();
    const { width } = await sharp(r).metadata();
    layers.push({ input: shadow(260, 70), left: Math.round(s.x - 130), top: s.top + s.height - 40, blend: "multiply" });
    layers.push({ input: r, left: Math.round(s.x - width / 2), top: s.top, blend: "multiply" });
  }
  return sharp(backdrop(W, H)).composite(layers).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

await mkdir(OUT, { recursive: true });
const cutouts = [];
for (const [name, src] of Object.entries(RACKETS)) {
  const racket = await cutout(src);
  cutouts.push(racket);
  const padded = await sharp(racket).resize({ width: 800, height: 1100, fit: "inside" }).toBuffer();
  await writeFile(path.join(OUT, `${name}.jpg`), await card(padded));
  console.log(`${name.padEnd(26)} done`);
}
await writeFile(path.join(OUT, "hero.jpg"), await hero(cutouts));
console.log("hero.jpg                   done");

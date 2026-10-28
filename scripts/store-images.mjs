#!/usr/bin/env node
/**
 * Saves trimmed copies of selected unitedsports.lk lifestyle photos into public/images/store/.
 * The store's listing photos sit on a white 1080×1350 canvas with a United Sports logo;
 * trimming removes that frame so the photo can fill a tile edge to edge.
 *
 *   node scripts/store-images.mjs [--force]
 *
 * URLs are read from src/data/products.seed.json, so they always point at the store listing.
 * Which product a tile shows (and whether it's in stock) is still decided at runtime.
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public", "images", "store");
const force = process.argv.includes("--force");
const seed = JSON.parse(readFileSync(path.join(root, "src", "data", "products.seed.json"), "utf8"));

/** name → [product slug, image index, optional extra crop of the side carrying the logo badge] */
const PICKS = {
  "axis-100-fs3-net": ["diadem-axis-100-fs3-tennis-racket", 6],
  "axis-100-fs3-ball": ["diadem-axis-100-fs3-tennis-racket", 5],
  "hush-sky": ["diadem-hush-pickleball-paddle-racket", 3, { top: 0.15 }],
  "solstice-power-player": ["diadem-solstice-power-16l-reel-tennis-string", 5, { bottom: 0.15 }],
  "solstice-power-closeup": ["diadem-solstice-power-16l-reel-tennis-string", 3],
  "solstice-power-frame": ["diadem-solstice-power-16l-reel-tennis-string", 4],
};

/** Extra crop (fraction per side) after trimming, to clear the logo badge. */
const INSET = 0.035;

await mkdir(OUT, { recursive: true });
for (const [name, [slug, index, crop = {}]] of Object.entries(PICKS)) {
  const file = path.join(OUT, `${name}.jpg`);
  if (!force && existsSync(file)) {
    console.log(`${name.padEnd(26)} skip`);
    continue;
  }
  const src = seed.find((p) => p.slug === slug)?.images[index]?.src;
  if (!src) {
    console.error(`${name.padEnd(26)} no image ${slug}#${index}`);
    process.exitCode = 1;
    continue;
  }
  const res = await fetch(src, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) {
    console.error(`${name.padEnd(26)} ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  const trimmed = await sharp(Buffer.from(await res.arrayBuffer()))
    .flatten({ background: "#ffffff" })
    .trim({ background: "#ffffff", threshold: 20 })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  const dx = Math.round(width * INSET);
  const top = Math.round(height * (INSET + (crop.top ?? 0)));
  const bottom = Math.round(height * (INSET + (crop.bottom ?? 0)));
  const out = await sharp(trimmed.data)
    .extract({ left: dx, top, width: width - 2 * dx, height: height - top - bottom })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer(); // metadata stripped
  await writeFile(file, out);
  const m = await sharp(out).metadata();
  console.log(`${name.padEnd(26)} ${m.width}×${m.height}`);
}

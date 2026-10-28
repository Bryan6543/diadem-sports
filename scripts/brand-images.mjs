#!/usr/bin/env node
/**
 * Downloads Diadem brand photography into public/images/brand/ (self-hosted copies).
 *
 *   node scripts/brand-images.mjs          # download missing images
 *   node scripts/brand-images.mjs --force  # re-download everything
 *
 * Every image is resized for the web and re-encoded, which strips EXIF/GPS metadata.
 * Source: diademsports.com (Diadem Sports' own marketing photography). United Sports should
 * confirm with Diadem / its distributor that brand imagery may be used — see README.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public", "images", "brand");
const force = process.argv.includes("--force");

const D = "https://diademsports.com/cdn/shop/files/";
const C = "https://cdn.shopify.com/s/files/1/0253/6210/4402/files/";

/** name → source URL. Names are what the site references: /images/brand/<name>.jpg */
export const BRAND_IMAGES = {
  // Project Bublik
  "bublik-portrait": `${C}SaRo_ProjectBublik-107.jpg`,
  "bublik-bench": `${D}SaRo_ProjectBublik-89.jpg`,
  "bublik-court": `${D}Bublik_March_2026-7328_flat.jpg`,
  "bublik-backhand": `${C}SaRo_ProjectBublik-129_1.jpg`,
  "bublik-racket-detail": `${D}Project_Bublik-9487.jpg`,
  "bublik-racket-signature": `${D}Project_Bublik-9494.jpg`,
  "bublik-racket-wall": `${D}Project_Bublik-9451.jpg`,
  // Tennis rackets
  "axis-on-court": `${D}Tennis_shoot-5828.jpg`,
  "axis-at-net": `${D}Axis_Lifestyle-5489_be0f7f50-599a-4638-a97a-4b4cdfccb8f1-ls2.jpg`,
  "axis-serve": `${D}Axis_Lifestyle-5684_702441f0-e5cb-4c7f-bd63-460e929a9ccf-ls1.jpg`,
  "axis-detail": `${D}Axis_details-1423.jpg`,
  "axis-towel": `${D}Tennis-629.png`,
  "nova-on-court": `${D}Nova_V3_on_court-21.jpg`,
  "rackets-fence": `${D}Tennis-247.jpg`,
  "tennis-at-net": `${D}tennis_mid_img2.jpg`,
  "tennis-balls-court": `${D}tennis4.jpg`,
  "elevate-on-court": `${D}ElevateV4_Lifestyle-3350.jpg`,
  // Pickleball, shoes, kit
  "pickleball-court": `${D}Dan_PickleBrosUK-5509.png`,
  "pickleballs": `${D}pickleballs_920_920_2.png`,
  "paddle-lifestyle": `${D}Edge_Flex_Lifestyle_42_Flat.jpg`,
  "bag-court": `${D}Paddle_bag_02_13a3ced3-1001-4628-a498-629b35d18259.png`,
  "socks": `${D}Socks_Ads_1080x1080_2.jpg`,
  // Team Diadem
  "athlete-alexander-bublik": `${C}SaRo_ProjectBublik-107.jpg`,
  "athlete-elina-svitolina": `${C}louislegon-1582_2.jpg`,
  "athlete-yuta-funemizu": `${C}Yuta_on_court_paddle-0763.jpg`,
  "athlete-sergio-martos": `${C}494864941_497683846765850_6377815733288964232_n.jpg`,
  "athlete-oliver-crawford": `${C}Oliver_Crawford_Sav_Challenger.jpg`,
  "athlete-javier-barranco": `${C}javi_B.png`,
  "athlete-siddhant-banthia": `${C}494690493_630392373354197_5110632112218787603_n.jpg`,
  "athlete-kiranpal-pannu": `${C}484244715_1083401020484211_5592455413704335611_n.jpg`,
  // Programmes / academies
  "club-players": `${C}1200_x_800_px_1.png`,
  "coach-lesson": `${C}team_img4.jpg`,
  "players-on-court": `${C}team1_img.jpg`,
  "indoor-courts": `${C}team3_img.jpg`,
};

async function fetchOne(name, url) {
  const file = path.join(OUT, `${name}.jpg`);
  if (!force && existsSync(file)) return "skip";
  const res = await fetch(`${url}?width=2400`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const input = Buffer.from(await res.arrayBuffer());
  const out = await sharp(input)
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer(); // no .withMetadata() → EXIF/GPS removed
  await writeFile(file, out);
  const m = await sharp(out).metadata();
  return `${m.width}×${m.height}`;
}

await mkdir(OUT, { recursive: true });
let failed = 0;
for (const [name, url] of Object.entries(BRAND_IMAGES)) {
  try {
    console.log(`${name.padEnd(28)} ${await fetchOne(name, url)}`);
  } catch (err) {
    failed++;
    console.error(`${name.padEnd(28)} FAILED ${err.message}`);
  }
}
if (failed) process.exit(1);

#!/usr/bin/env node
/**
 * Imports every Diadem product from the United Sports Shopify store into
 * src/data/products.seed.json (the bundled catalogue + first-run database seed).
 *
 *   node scripts/import-store.mjs
 *
 * Only public data is read: https://unitedsports.lk/products.json
 * Names, prices, stock, photos and spec tables all come from the retailer listing.
 * Subjective rating rows ("High", "★★★★★") and "Confirm with manufacturer"
 * placeholders are dropped so the site never shows unverified claims as specs.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const STORE = "https://unitedsports.lk";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "products.seed.json");

/* ---------- helpers ---------- */
const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&times;/g, "×");
const text = (html) => decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ")).replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const RATING = /^(very high|high|moderate|medium|low|excellent|good|very good)$/i;
const PLACEHOLDER = /confirm|not specified|n\/a/i;
const DROP_LABELS = /^(brand|condition|specification|details|model|category)$/i;
const SECTION_END = /what[’']s included|ideal for/i;

function parseBody(html) {
  const description = [];
  const features = [];
  const specs = [];
  const included = [];
  const idealFor = [];

  // Description: <p> blocks that are plain prose (no label-only paragraphs).
  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = text(m[1]);
    if (!t) continue;
    if (/^product code|^manufacturing/i.test(t)) continue;
    if (SECTION_END.test(t.split("\n")[0])) {
      const [head, ...rest] = t.split("\n");
      const body = rest.join(" ").trim();
      if (/included/i.test(head) && body) included.push(...body.split(/\s*(?=\d+\s*[x×]\s)/i).filter(Boolean));
      if (/ideal/i.test(head) && body) idealFor.push(body);
      continue;
    }
    if (t.length > 60) description.push(t.replace(/\n/g, " "));
  }

  // Lists: classify by the heading that precedes them.
  const listRe = /(?:<(h\d|p)[^>]*>([\s\S]*?)<\/\1>\s*)?<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  for (const m of html.matchAll(listRe)) {
    const heading = m[2] ? text(m[2]) : "";
    const items = [...m[3].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => text(x[1])).filter(Boolean);
    if (/included/i.test(heading)) included.push(...items);
    else if (/ideal/i.test(heading)) idealFor.push(...items);
    else if (!features.length) features.push(...items);
  }

  // Spec tables.
  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => text(c[1]));
    if (cells.length < 2) continue;
    const [label, value] = cells;
    if (!label || !value) continue;
    if (DROP_LABELS.test(label) || RATING.test(value) || /★/.test(value) || PLACEHOLDER.test(value)) continue;
    if (SECTION_END.test(label)) continue;
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) continue;
    specs.push({ label, value: value.replace(/\*$/, "") });
  }

  return { description, features, specs, included, idealFor };
}

/* ---------- classification ---------- */
function classify(p, specs) {
  const t = p.title;
  const format = specs.find((s) => /format/i.test(s.label))?.value ?? "";
  const tags = p.tags.map((x) => x.toLowerCase());
  const has = (x) => tags.includes(x);
  if (has("tennis-racket")) {
    const series = /axis/i.test(t) ? "Axis" : /nova/i.test(t) ? "Nova" : /elevate/i.test(t) ? "Elevate" : "Rackets";
    return { category: "tennis-rackets", type: series, sport: "tennis" };
  }
  if (has("tennis-string")) return { category: "strings", type: /reel/i.test(t) || /reel/i.test(format) ? "Reels" : "String sets", sport: "tennis" };
  if (/paddle/i.test(t) && !/kit/i.test(t)) return { category: "pickleball", type: "Paddles", sport: "pickleball" };
  if (/kit/i.test(t) && has("pickleball")) return { category: "pickleball", type: "Starter kits", sport: "pickleball" };
  if (has("paddle-racket")) return { category: "pickleball", type: "Paddles", sport: "pickleball" };
  if (has("pickleball-ball")) return { category: "pickleball", type: "Pickleballs", sport: "pickleball" };
  if (has("tennis-ball")) return { category: "accessories", type: "Tennis balls", sport: "tennis" };
  if (has("dampener")) return { category: "accessories", type: "Dampeners", sport: "tennis" };
  if (has("tennis-shoe")) return { category: "shoes-apparel", type: "Shoes", sport: "tennis" };
  if (has("sock")) return { category: "shoes-apparel", type: "Socks", sport: "all" };
  if (has("wrist-band")) return { category: "shoes-apparel", type: "Wristbands", sport: "all" };
  if (/hat|visor|cap/i.test(t)) return { category: "shoes-apparel", type: "Headwear", sport: "all" };
  if (has("pickleball")) return { category: "pickleball", type: "Paddles", sport: "pickleball" };
  return { category: "accessories", type: "Accessories", sport: "all" };
}

/** Technologies are attached only where the retailer listing or Diadem's official page for the same model names them. */
function technologies(p) {
  const t = p.title;
  if (/axis/i.test(t)) return ["kraibon", "fs-system", "hmt-carbon", "air-foil-frame", "precision-strike-zone"];
  if (/nova/i.test(t)) return ["kraibon", "fs-system", "hmt-carbon"];
  if (/elevate/i.test(t)) return ["kraibon", "fs-system", "hmt-carbon"];
  if (/hush/i.test(t)) return ["etpu-quiet-face"];
  if (/icon/i.test(t)) return ["japanese-carbon"];
  if (/solstice power/i.test(t)) return ["star-profile"];
  if (/court burst/i.test(t)) return ["rebound-x", "max-shield"];
  if (/select (visor )?hat|visor/i.test(t) && /polyester/i.test(t)) return ["drycore"];
  return [];
}

const FEATURED = [/axis 100/i, /nova 100/i, /elevate lite/i, /hush/i, /icon classic/i, /a52/i, /solstice power 16l reel/i, /court burst/i];
const SPOTLIGHT = [/axis 100/i, /hush/i];

function cleanName(title) {
  return title
    .replace(/\bDIADEM\b/g, "Diadem")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\(1 pcs ?\)/i, "")
    .trim();
}

/* ---------- main ---------- */
async function fetchAll() {
  const all = [];
  for (let page = 1; page < 30; page++) {
    const res = await fetch(`${STORE}/products.json?limit=250&page=${page}`, { headers: { "User-Agent": "diadem-showcase-import" } });
    if (!res.ok) throw new Error(`Store responded ${res.status}`);
    const { products } = await res.json();
    if (!products.length) break;
    all.push(...products);
  }
  return all;
}

const all = await fetchAll();
const diadem = all.filter((p) => /diadem/i.test(p.vendor) || /diadem/i.test(p.title));
const used = new Set();

const products = diadem.map((p) => {
  const name = cleanName(p.title);
  let slug = slugify(name);
  while (used.has(slug)) slug += "-2";
  used.add(slug);
  const body = parseBody(p.body_html || "");
  const { category, type, sport } = classify(p, body.specs);
  const variants = p.variants
    .filter((v) => v.title !== "Default Title")
    .map((v) => ({ name: v.title, available: v.available }));
  const prices = p.variants.map((v) => Number(v.price));
  const price = Math.min(...prices);
  const compares = p.variants.map((v) => Number(v.compare_at_price || 0)).filter((c) => c > price);
  const featuredIdx = FEATURED.findIndex((r) => r.test(name));
  return {
    id: `us-${p.id}`,
    slug,
    name,
    category,
    type,
    sport,
    shortDescription: body.description[0] ?? name,
    description: body.description,
    features: body.features.slice(0, 10),
    specs: body.specs,
    included: body.included,
    idealFor: body.idealFor,
    technologies: technologies(p),
    price,
    compareAtPrice: compares.length ? Math.max(...compares) : null,
    inStock: p.variants.some((v) => v.available),
    variants,
    images: p.images.slice(0, 8).map((img, i) => ({
      src: img.src,
      alt: i === 0 ? name : `${name} — view ${i + 1}`,
      width: img.width,
      height: img.height,
    })),
    retailerHandle: p.handle,
    retailerUrl: `https://www.unitedsports.lk/products/${p.handle}`,
    featured: featuredIdx !== -1,
    featuredRank: featuredIdx === -1 ? null : featuredIdx,
    spotlight: SPOTLIGHT.some((r) => r.test(name)),
    published: true,
    tags: p.tags,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
});

// Keep the Diadem-range information pages added by scripts/import-diadem.mjs (ids starting with "dd-").
const diademRange = JSON.parse(await readFile(OUT, "utf8").catch(() => "[]")).filter((p) => p.id.startsWith("dd-"));
const merged = [...products, ...diademRange].sort((a, b) => a.category.localeCompare(b.category) || b.price - a.price);
await writeFile(OUT, JSON.stringify(merged, null, 2) + "\n");
console.log(`Imported ${products.length} Diadem products from ${STORE} → ${path.relative(process.cwd(), OUT)}`);
for (const p of products) console.log(`  ${p.category.padEnd(15)} ${p.type.padEnd(13)} ${p.name}  (${p.specs.length} specs, ${p.images.length} photos${p.inStock ? "" : ", sold out"})`);

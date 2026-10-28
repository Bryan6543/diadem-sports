#!/usr/bin/env node
/**
 * Adds Diadem products that United Sports does not list, taken from Diadem's official store,
 * to src/data/products.seed.json as information-only pages (no price, no Buy button).
 *
 *   node scripts/import-diadem.mjs
 *
 * Only public data is read: https://diademsports.com/products.json
 * The PICK list below is hand-curated: apparel (shirts, shorts, skirts…), demo rentals, gift cards,
 * services and anything already sold by United Sports are left out on purpose.
 * Re-running replaces the earlier Diadem imports (ids "dd-<number>"), keeps each one's published
 * flag, and leaves the United Sports products and hand-added entries untouched.
 * Since 2026-10-28 the site shows only what United Sports sells, so these pages are unpublished
 * except the rackets in src/data/arriving-soon.ts.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const STORE = "https://diademsports.com";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "products.seed.json");

/* ---------- what to import: handle → placement (+ optional name / extra handles for photos) ---------- */
const R = (type) => ({ category: "tennis-rackets", type, sport: "tennis" });
const PB = (type) => ({ category: "pickleball", type, sport: "pickleball" });
const S = (type) => ({ category: "strings", type, sport: "tennis" });
const A = (type, sport = "tennis") => ({ category: "accessories", type, sport });
const W = (type) => ({ category: "shoes-apparel", type, sport: "all" });
const B = (type) => ({ category: "bags", type, sport: "all" });

const PICK = {
  // Tennis rackets
  "axis-98": R("Axis"),
  "axis-team": R("Axis"),
  "axis-98-elina-svitolina": R("Axis"),
  "project-bublik-98": R("Project Bublik"),
  "project-bublik-100": R("Project Bublik"),
  "project-bublik-100-team": R("Project Bublik"),
  "nova-v3-plus": R("Nova"),
  "nova-v3-tour": R("Nova"),
  "nova-v3-team": R("Nova"),
  "nova-v3-lite": R("Nova"),
  "nova-elt": R("Nova"),
  "diadem-nova-fs-100-lite-tennis-racket": R("Nova"),
  "diadem-nova-105-fs": R("Nova"),
  "elevate-v4-98": R("Elevate"),
  "elevate-v4-tour-98": R("Elevate"),
  "elevate-v4-team-98": R("Elevate"),
  "diadem-elevate-v3": R("Elevate"),
  "diadem-elevate-tour-v3": R("Elevate"),
  "elevate-elt": R("Elevate"),
  dream: R("Dream"),
  "bublik-junior-25": R("Junior"),
  "bublik-junior-25-copy": R("Junior"),
  "diadem-super-19-junior-racket": R("Junior"),
  "diadem-super-21-junior-racket": R("Junior"),
  "diadem-super-23-junior-racket": R("Junior"),
  "diadem-super-25-pink-junior-racket": R("Junior"),
  "diadem-super-26-yellow-junior-racket": R("Junior"),
  "diadem-rise-25-grey-junior-racket-strung": R("Junior"),
  "diadem-teal-rise-26-junior-racket": R("Junior"),

  // Pickleball paddles, kits, balls and paddle accessories
  "edge-blucore": PB("Paddles"),
  "edge-blucore-hybrid": PB("Paddles"),
  "edge-blucore-yuta-special-edition": PB("Paddles"),
  "monopoly-edge-blucore": PB("Paddles"),
  "edge-18k-power": PB("Paddles"),
  "edge-18k-max": PB("Paddles"),
  "edge-18k-sp": PB("Paddles"),
  "diadem-warrior": PB("Paddles"),
  warriorblucore: PB("Paddles"),
  "diadem-warrior-v2": PB("Paddles"),
  "diadem-warrior-edge": PB("Paddles"),
  rush: PB("Paddles"),
  "diadem-hero-paddle": PB("Paddles"),
  "diadem-team-paddles": { ...PB("Paddles"), name: "Diadem Team Paddle" },
  "guy-harvey-limited-edition-paddles": PB("Paddles"),
  "shelby-sandy-the-skull": { ...PB("Paddles"), name: "Diadem The Skull Paddle by Shelby and Sandy" },
  "shelby-sandy-rush-people-of-pickleball": { ...PB("Paddles"), name: "Diadem People of Pickleball Paddle by Shelby and Sandy" },
  "shelby-sandy-icon-infinity-pro-the-icons": { ...PB("Paddles"), name: "Diadem Icons Paddle by Shelby and Sandy" },
  "first-responders-warrior-edge": PB("Paddles"),
  "copy-of-first-responders-series-v2-rush": PB("Paddles"),
  "monopoly-starter-kit": PB("Starter kits"),
  "the-official-pickleball": { ...PB("Pickleballs"), name: "Diadem Official Pickleball" },
  "official-pickleball-indoor-pickleball": { ...PB("Pickleballs"), name: "Diadem Official Indoor Pickleball" },
  "the-official-quiet-ball": { ...PB("Pickleballs"), name: "Diadem Official Quiet Ball" },
  "power-premier-pickleball": PB("Pickleballs"),
  "premier-40-outdoor-pickleballs": PB("Pickleballs"),
  "giant-official-pickleball": PB("Pickleballs"),
  "paddle-weight": PB("Paddle accessories"),
  "paddle-cleaner": PB("Paddle accessories"),
  "diadem-warrior-v2-paddle-armor": PB("Paddle accessories"),
  "diadem-paddle-cover": PB("Paddle accessories"),
  "icon-infinity-edge-guard-kit": PB("Paddle accessories"),
  "icon-v2-edge-guard-kit": PB("Paddle accessories"),
  "icon-edge-guard-kit": PB("Paddle accessories"),

  // Strings (formats United Sports doesn't carry)
  "dark-matter": { ...S("String sets"), name: "Diadem Dark Matter String Set" },
  "sg-ultra-set": { ...S("String sets"), name: "Diadem SG Ultra String Set" },
  "diadem-sg-ultra-reel": S("Reels"),
  "evolution-tennis-string": { ...S("String sets"), name: "Diadem Evolution String Set" },
  "evolution-tennis-string-reel": S("Reels"),
  "diadem-impulse-tennis-string": { ...S("String sets"), name: "Diadem Impulse String Set" },
  "diadem-impulse-tennis-string-reel": S("Reels"),
  "elite-xt-tennis-string": { ...S("String sets"), name: "Diadem Elite XT String Set" },
  "diadem-elite-tennis-string-reel": S("Reels"),

  // Balls, grips, court equipment, racket care
  "diadem-premier-pressureless-ball-can": A("Tennis balls"),
  "diadem-premier-high-altitude-ball-can": A("Tennis balls"),
  "diadem-stage-1-green-dot-tennis-ball-can": A("Tennis balls"),
  "diadem-stage-2-orange-dot-tennis-ball-can": A("Tennis balls"),
  "diadem-stage-3-red-dot-ball-can": A("Tennis balls"),
  "diadem-premier-team-ball-case": A("Tennis balls"),
  "diadem-premier-padel-balls-can": A("Padel balls", "all"),
  "pro-feel-overgrip": A("Grips", "all"),
  "comfort-max-replacement-grip": A("Grips"),
  "copy-of-diadem-comfort-max-replacement-grip": A("Grips"),
  "diadem-vintage-feel-hybrid-replacement-grip": A("Grips"),
  "diadem-ball-cart-150-ball": A("Court equipment", "all"),
  "ball-cart-accessories": A("Court equipment", "all"),
  "premier-rollout-net": A("Court equipment", "all"),
  "replacement-grommet": A("Racket care"),
  "stencil-and-ink-4": A("Racket care"),
  "tennis-ball-can-tumbler": A("Gifts", "all"),

  // Shoes, socks, headwear, wristbands (no shirts/shorts/skirts)
  "diadem-court-flo-black-teal": {
    ...W("Shoes"),
    name: "Diadem Court Flo",
    allOptions: true,
    photosFrom: ["diadem-court-flo-white-sky", "diadem-court-flo-white-navy"],
  },
  "diadem-court-slides": {
    name: "Diadem Court Slides", ...W("Shoes"), photosFrom: ["diadem-court-slides-black", "diadem-court-slides-pink", "diadem-court-slides-artic-mist"] },
  "diadem-performance-quarter-socks": W("Socks"),
  "diadem-performance-socks": W("Socks"),
  "diadem-blucore-hat": W("Headwear"),
  "diadem-drycore-logo-wristband-4-5": W("Wristbands"),
  "diadem-logo-small-wristbands": W("Wristbands"),

  // Bags
  "diadem-tour-v3-9pk-elevate": B("Racket bags"),
  "diadem-tour-v3-12pk-elevate": B("Racket bags"),
  "diadem-tour-v3-elevate-duffel-bag-navy": B("Duffels & backpacks"),
  "diadem-tour-v3-backpack": B("Duffels & backpacks"),
  "diadem-tour-v2-paddle-bag": B("Paddle bags"),
  "the-artists-tote-by-shelby-sandy": { ...B("Totes & drawstrings"), name: "Diadem The Artist’s Tote by Shelby and Sandy" },
  "diadem-draw-string-bag": { ...B("Totes & drawstrings"), name: "Diadem Drawstring Bag" },
};

/** Official listings with no written description: a factual line built from the listing itself. */
const FALLBACK_DESCRIPTION = {
  "icon-infinity-edge-guard-kit": "Replacement edge guard kit for the Diadem Icon Infinity paddle, made for the Pro and Max models.",
};

/* ---------- helpers ---------- */
const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&times;/g, "×")
    .replace(/&[a-z]+;/g, " ");
const text = (html) =>
  decode(html.replace(/<br\b[^>]*>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/["”’'()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Sales copy and store-only notes that make no sense on a Sri Lankan information page. */
const PROMO = /strung here|stringing service|grab yours|buy now|order now|add to cart|free shipping|click|shop now|available now\.?$|coupon|discount|\bsale\b|warranty claim|^specs?:?$/i;

function parseBody(html) {
  const description = [];
  const features = [];
  const specs = [];
  const addSpec = (label, value) => {
    label = label.replace(/[\s:*-]+$/, "").trim();
    if (/^colou?rs?$/i.test(label)) label = "Colours";
    value = value.replace(/^[:\s]+/, "").trim();
    if (!label || !/[a-z0-9]/i.test(value) || label.length > 32 || value.length > 120) return false;
    // "Reduced Noise: Ideal for indoor use…" is a selling point, not a measurement.
    if (!/\d/.test(value) && value.length > 30 && / /.test(value) && !/^colou?rs?|material|construction|type/i.test(label)) return false;
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) return true;
    specs.push({ label: label[0].toUpperCase() + label.slice(1), value });
    return true;
  };

  // Prose paragraphs (a paragraph may hold several <br>-separated blocks).
  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    for (const block of text(m[1]).split(/\n{1,}/)) {
      const t = block.trim();
      if (!t || PROMO.test(t)) continue;
      const kv = t.match(/^([A-Za-z][A-Za-z /&()-]{1,30}):\s*(.+)$/);
      if (kv && t.length < 90 && addSpec(kv[1], kv[2])) continue;
      if (t.length > 60) description.push(t);
    }
  }

  // List items: "Label: value" become specs, the rest are features. Nested lists are flattened.
  for (const m of html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    if (/<li/i.test(m[1])) continue;
    const t = text(m[1]).replace(/\n/g, " ");
    if (!t || PROMO.test(t)) continue;
    const kv = t.match(/^([^:]{2,32}):\s*(.+)$/);
    if (kv && addSpec(kv[1], kv[2])) continue;
    if (/^\d+[A-Z]?\s*\(/.test(t) || t.length < 4) continue; // bare gauge values from nested lists
    if (!features.includes(t)) features.push(t);
  }

  // <div> blocks: "Specs:" lines, or prose when the listing has no <p> paragraphs.
  for (const m of html.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi)) {
    for (const line of text(m[1]).split("\n")) {
      const kv = line.match(/^([A-Za-z][A-Za-z /&()-]{1,30})[:\s]+([\d.].*)$/);
      if (kv) addSpec(kv[1], kv[2]);
      else if (line.length > 60 && !PROMO.test(line) && !description.includes(line)) description.push(line);
    }
  }

  // Two-column spec tables.
  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => text(c[1]).replace(/\n/g, " "));
    if (cells.length !== 2 || /<ul/i.test(row[1])) continue;
    addSpec(cells[0].toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()), cells[1]);
  }

  return { description, features, specs };
}

const OPTION_LABEL = {
  color: "Colours",
  colour: "Colours",
  "grip size": "Grip sizes",
  grip: "Grip sizes",
  gauge: "Gauges",
  "gauge-imp": "Gauges",
  frame: "Frames",
  size: "Sizes",
  "head size": "Head sizes",
  quantity: "Pack sizes",
  "ball count": "Pack sizes",
  "product type": "Pack sizes",
  shape: "Shapes",
  "paddle shape": "Shapes",
  thickness: "Thickness",
  model: "Models",
  style: "Styles",
  type: "Types",
  options: "Options",
  width: "Widths",
};

/** Listing options (colours, grip sizes, gauges…) shown as spec rows instead of buyable variants. */
function optionSpecs(p, specs, pick) {
  const rows = [];
  for (const o of p.options) {
    const key = o.name.toLowerCase();
    if (key === "title" || /men's\/women's/i.test(o.name)) continue;
    // Some listings share one option set across sibling products — keep only values this product actually has,
    // unless this entry stands for the whole family (e.g. every Court Flo colourway).
    const idx = p.options.indexOf(o);
    const used = pick.allOptions ? o.values : [...new Set(p.variants.map((v) => v[`option${idx + 1}`]).filter(Boolean))];
    if (!used.length || (key === "frame" && used.length === 1)) continue;
    let label = OPTION_LABEL[key] ?? o.name;
    if (key === "size" && pick.type === "Pickleballs") label = "Pack sizes";
    if (key === "size" && pick.category === "tennis-rackets") label = "Head sizes";
    if (specs.some((s) => s.label.toLowerCase().startsWith(label.toLowerCase().slice(0, 4)))) continue;
    rows.push({ label, value: used.join(" · ") });
  }
  return rows;
}

/** Technology tags only where the official copy names them; racket tech is limited to rackets. */
function technologies(name, html, category) {
  const t = `${name} ${text(html)}`;
  const out = [];
  if (/drycore/i.test(t)) out.push("drycore");
  if (category !== "tennis-rackets") return out;
  if (/kraibon/i.test(t)) out.push("kraibon");
  if (/flex stabilization|\bFS3?\b/i.test(t) && /racket|frame/i.test(t)) out.push("fs-system");
  if (/\bHMT\b/i.test(t)) out.push("hmt-carbon");
  if (/air ?foil/i.test(t)) out.push("air-foil-frame");
  if (/precision\s*\+?\s*strike/i.test(t)) out.push("precision-strike-zone");
  return out;
}

const cleanName = (title, override) => {
  let n = (override ?? title).replace(/\bDIADEM\b/g, "Diadem").replace(/\s{2,}/g, " ").trim();
  if (!/^diadem\b/i.test(n)) n = `Diadem ${n}`;
  return n;
};

const images = (list, name, offset = 0) =>
  list.map((img, i) => ({
    src: img.src,
    alt: i + offset === 0 ? name : `${name} — view ${i + offset + 1}`,
    width: img.width,
    height: img.height,
  }));

/* ---------- main ---------- */
async function fetchAll() {
  const all = [];
  for (let page = 1; page < 10; page++) {
    const res = await fetch(`${STORE}/products.json?limit=250&page=${page}`, { headers: { "User-Agent": "diadem-showcase-import" } });
    if (!res.ok) throw new Error(`Diadem store responded ${res.status}`);
    const { products } = await res.json();
    if (!products.length) break;
    all.push(...products);
  }
  return all;
}

const all = await fetchAll();
const byHandle = new Map(all.map((p) => [p.handle, p]));
const current = JSON.parse(await readFile(OUT, "utf8"));
// Earlier imports are "dd-<Diadem id>"; hand-added entries (e.g. "dd-…-teal") are kept as they are.
const isImport = (p) => /^dd-\d+$/.test(p.id);
const existing = current.filter((p) => !isImport(p));
const wasPublished = new Map(current.filter(isImport).map((p) => [p.id, p.published]));
const used = new Set(existing.map((p) => p.slug));
const missing = [];

const imported = [];
for (const [handle, pick] of Object.entries(PICK)) {
  const p = byHandle.get(handle);
  if (!p) {
    missing.push(handle);
    continue;
  }
  const name = cleanName(p.title, pick.name);
  let slug = slugify(name);
  while (used.has(slug)) slug += "-2";
  used.add(slug);

  const body = parseBody(p.body_html || "");
  const description = body.description.length ? body.description : FALLBACK_DESCRIPTION[handle] ? [FALLBACK_DESCRIPTION[handle]] : [];
  const specs = [...body.specs, ...optionSpecs(p, body.specs, pick)];
  // A one-line teaser ("The Axis is the newest series…") makes a thin summary — use the first real paragraph.
  const summary = description.find((d) => d.length >= 100) ?? description[0] ?? name;

  let photos = images(p.images.slice(0, 8), name);
  if (pick.photosFrom) {
    const extra = pick.photosFrom.flatMap((h) => byHandle.get(h)?.images.slice(0, 2) ?? []);
    photos = [...images(p.images.slice(0, 4), name), ...images(extra, name, 4)].slice(0, 8);
  }

  imported.push({
    id: `dd-${p.id}`,
    slug,
    name,
    category: pick.category,
    type: pick.type,
    sport: pick.sport,
    shortDescription: summary,
    description,
    features: body.features.slice(0, 10),
    specs,
    included: [],
    idealFor: [],
    technologies: technologies(name, p.body_html || "", pick.category),
    // Not sold by United Sports: no price, no retailer link — the site shows these as information pages.
    price: 0,
    compareAtPrice: null,
    inStock: false,
    variants: [],
    images: photos,
    retailerHandle: "",
    retailerUrl: "",
    featured: false,
    featuredRank: null,
    spotlight: false,
    // The site shows only what United Sports sells (plus src/data/arriving-soon.ts): new imports start hidden.
    published: wasPublished.get(`dd-${p.id}`) ?? false,
    tags: ["diadem-official", ...p.tags.filter((t) => /^(tennis|pickleball|padel|shoes|bags|grips|balls)$/i.test(t)).map((t) => t.toLowerCase())],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  });
}

const products = [...existing, ...imported].sort((a, b) => a.category.localeCompare(b.category) || b.price - a.price);
await writeFile(OUT, JSON.stringify(products, null, 2) + "\n");
console.log(`Added ${imported.length} information-only products from ${STORE} (kept ${existing.length} United Sports products).`);
if (missing.length) console.log(`Not found on ${STORE} (skipped): ${missing.join(", ")}`);
for (const p of imported)
  console.log(`  ${p.category.padEnd(15)} ${p.type.padEnd(20)} ${p.name}  (${p.description.length} paras, ${p.features.length} features, ${p.specs.length} specs, ${p.images.length} photos)`);

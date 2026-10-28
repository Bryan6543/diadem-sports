/**
 * Turns United Sports' Shopify listing HTML into structured fields.
 * Mirrors scripts/import-store.mjs so admin imports produce the same shape as the bundled seed.
 * Subjective rating rows ("High", "★★★★★") and "Confirm with manufacturer" placeholders are dropped.
 */
import type { CategorySlug, ImageRef, Product, Sport } from "./types";

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&times;/g, "×");
const text = (html: string) =>
  decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();

const RATING = /^(very high|high|moderate|medium|low|excellent|good|very good)$/i;
const PLACEHOLDER = /confirm|not specified|n\/a/i;
const DROP_LABELS = /^(brand|condition|specification|details|model|category)$/i;
const SECTION_END = /what[’']s included|ideal for/i;

export function parseListingHtml(html: string) {
  const description: string[] = [];
  const features: string[] = [];
  const specs: { label: string; value: string }[] = [];
  const included: string[] = [];
  const idealFor: string[] = [];

  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = text(m[1]);
    if (!t || /^product code|^manufacturing/i.test(t)) continue;
    const [head, ...rest] = t.split("\n");
    if (SECTION_END.test(head)) {
      const body = rest.join(" ").trim();
      if (/included/i.test(head) && body) included.push(...body.split(/\s*(?=\d+\s*[x×]\s)/i).filter(Boolean));
      if (/ideal/i.test(head) && body) idealFor.push(body);
      continue;
    }
    if (t.length > 60) description.push(t.replace(/\n/g, " "));
  }

  for (const m of html.matchAll(/(?:<(h\d|p)[^>]*>([\s\S]*?)<\/\1>\s*)?<ul[^>]*>([\s\S]*?)<\/ul>/gi)) {
    const heading = m[2] ? text(m[2]) : "";
    const items = [...m[3].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => text(x[1])).filter(Boolean);
    if (/included/i.test(heading)) included.push(...items);
    else if (/ideal/i.test(heading)) idealFor.push(...items);
    else if (!features.length) features.push(...items);
  }

  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => text(c[1]));
    const [label, value] = cells;
    if (!label || !value) continue;
    if (DROP_LABELS.test(label) || RATING.test(value) || value.includes("★") || PLACEHOLDER.test(value) || SECTION_END.test(label)) continue;
    if (specs.some((s) => s.label.toLowerCase() === label.toLowerCase())) continue;
    specs.push({ label, value: value.replace(/\*$/, "") });
  }
  return { description, features: features.slice(0, 10), specs, included, idealFor };
}

export function classifyListing(title: string, tags: string[], format = ""): { category: CategorySlug; type: string; sport: Sport } {
  const has = (x: string) => tags.map((t) => t.toLowerCase()).includes(x);
  if (has("tennis-racket")) {
    const series = /axis/i.test(title) ? "Axis" : /nova/i.test(title) ? "Nova" : /elevate/i.test(title) ? "Elevate" : "Rackets";
    return { category: "tennis-rackets", type: series, sport: "tennis" };
  }
  if (has("tennis-string")) return { category: "strings", type: /reel/i.test(title) || /reel/i.test(format) ? "Reels" : "String sets", sport: "tennis" };
  if (/paddle/i.test(title) && !/kit/i.test(title)) return { category: "pickleball", type: "Paddles", sport: "pickleball" };
  if (/kit/i.test(title) && has("pickleball")) return { category: "pickleball", type: "Starter kits", sport: "pickleball" };
  if (has("pickleball-ball")) return { category: "pickleball", type: "Pickleballs", sport: "pickleball" };
  if (has("tennis-ball")) return { category: "accessories", type: "Tennis balls", sport: "tennis" };
  if (has("dampener")) return { category: "accessories", type: "Dampeners", sport: "tennis" };
  if (has("tennis-shoe")) return { category: "shoes-apparel", type: "Shoes", sport: "tennis" };
  if (has("sock")) return { category: "shoes-apparel", type: "Socks", sport: "all" };
  if (has("wrist-band")) return { category: "shoes-apparel", type: "Wristbands", sport: "all" };
  if (/hat|visor|cap/i.test(title)) return { category: "shoes-apparel", type: "Headwear", sport: "all" };
  if (has("pickleball")) return { category: "pickleball", type: "Paddles", sport: "pickleball" };
  return { category: "accessories", type: "Accessories", sport: "all" };
}

export const cleanName = (title: string) =>
  title
    .replace(/\bDIADEM\b/g, "Diadem")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\(1 pcs ?\)/i, "")
    .trim();

interface ShopifyProductJson {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  tags: string[] | string;
  images: { src: string; width?: number; height?: number }[];
  variants: { title: string; price: string; compare_at_price: string | null; available?: boolean }[];
}

export function imagesFromShopify(p: Pick<ShopifyProductJson, "title" | "images">, max = 8): ImageRef[] {
  return p.images.slice(0, max).map((img, i) => ({
    src: img.src,
    alt: i === 0 ? cleanName(p.title) : `${cleanName(p.title)} — view ${i + 1}`,
    width: img.width,
    height: img.height,
  }));
}

/** Fetches /products/<handle>.json from the retailer store (public endpoint). */
export async function fetchStoreProduct(storeUrl: string, handle: string): Promise<ShopifyProductJson | null> {
  if (!/^[a-z0-9-]+$/i.test(handle)) return null;
  try {
    const res = await fetch(`${storeUrl.replace(/\/$/, "")}/products/${handle}.json`, {
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { product } = (await res.json()) as { product: ShopifyProductJson };
    if (typeof product.tags === "string") product.tags = product.tags.split(",").map((t) => t.trim());
    return product;
  } catch {
    return null;
  }
}

/** Price/stock summary for a Shopify product. */
export function pricing(p: Pick<ShopifyProductJson, "variants">) {
  const price = Math.min(...p.variants.map((v) => Number(v.price)));
  const compares = p.variants.map((v) => Number(v.compare_at_price || 0)).filter((c) => c > price);
  return {
    price,
    compareAtPrice: compares.length ? Math.max(...compares) : null,
    inStock: p.variants.some((v) => v.available !== false),
    variants: p.variants.filter((v) => v.title !== "Default Title").map((v) => ({ name: v.title, available: v.available !== false })),
  };
}

/** Builds a full Product from a Shopify listing (used by CSV/store import). */
export function productFromShopify(p: ShopifyProductJson, storeUrl: string, slug: string): Product {
  const tags = Array.isArray(p.tags) ? p.tags : String(p.tags).split(",").map((t) => t.trim());
  const body = parseListingHtml(p.body_html || "");
  const format = body.specs.find((s) => /format/i.test(s.label))?.value ?? "";
  const { category, type, sport } = classifyListing(p.title, tags, format);
  const name = cleanName(p.title);
  return {
    id: `us-${p.id}`,
    slug,
    name,
    category,
    type,
    sport,
    shortDescription: body.description[0] ?? name,
    description: body.description,
    features: body.features,
    specs: body.specs,
    included: body.included,
    idealFor: body.idealFor,
    technologies: [],
    ...pricing(p),
    images: imagesFromShopify(p),
    retailerHandle: p.handle,
    retailerUrl: `${storeUrl.replace(/\/$/, "")}/products/${p.handle}`,
    featured: false,
    featuredRank: null,
    spotlight: false,
    published: true,
    tags,
  };
}

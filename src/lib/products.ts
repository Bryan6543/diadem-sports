import "server-only";
import { unstable_cache } from "next/cache";
import { seedProducts } from "@/data/products";
import { dbListProducts } from "./server/products-db";
import type { Product } from "./types";

export const PRODUCTS_TAG = "products";

/** Products from the database (cached 1 hour, tag "products"), falling back to bundled data. */
const loadProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const rows = await dbListProducts();
      if (rows && rows.length) return rows;
    } catch (err) {
      console.error("[products] database unavailable, using bundled data:", (err as Error).message);
    }
    return seedProducts;
  },
  ["products-v2"],
  { tags: [PRODUCTS_TAG], revalidate: 3600 },
);

export async function getProducts() {
  return (await loadProducts()).filter((p) => p.published);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsBySlugs(slugs: string[]) {
  const all = await getProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export async function getProductsByCategory(category: string) {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function getFeaturedProducts(limit = 8) {
  return (await getProducts())
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
    .slice(0, limit);
}

export async function getSpotlightProducts() {
  const all = await getProducts();
  const spot = all.filter((p) => p.spotlight);
  return (spot.length ? spot : all.filter((p) => p.featured)).slice(0, 2);
}

export async function getProductsByTechnology(slug: string) {
  return (await getProducts()).filter((p) => p.technologies.includes(slug));
}

/** Same type first, then the rest of the category. */
export async function getRelatedProducts(product: Product, limit = 4) {
  const all = (await getProducts()).filter((p) => p.id !== product.id);
  const sameType = all.filter((p) => p.category === product.category && p.type === product.type);
  const sameCat = all.filter((p) => p.category === product.category && p.type !== product.type);
  return [...sameType, ...sameCat].slice(0, limit);
}

const COMPLEMENTS: Record<string, string[]> = {
  "tennis-rackets": ["strings", "accessories", "shoes-apparel"],
  strings: ["tennis-rackets", "accessories"],
  pickleball: ["shoes-apparel"],
  "shoes-apparel": ["tennis-rackets", "pickleball"],
  accessories: ["tennis-rackets", "strings"],
  bags: ["tennis-rackets", "pickleball", "accessories"],
};

/** Gear that goes with this product, e.g. strings and a dampener for a racket. */
export async function getComplementaryProducts(product: Product, limit = 4) {
  const all = (await getProducts()).filter((p) => p.id !== product.id && p.inStock);
  const cats = COMPLEMENTS[product.category] ?? [];
  const picked: Product[] = [];
  for (const c of cats) {
    const match = all.find((p) => p.category === c && !picked.includes(p));
    if (match) picked.push(match);
  }
  for (const p of all) {
    if (picked.length >= limit) break;
    if (!picked.includes(p) && cats.includes(p.category)) picked.push(p);
  }
  return picked.slice(0, limit);
}

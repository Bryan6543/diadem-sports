import { arrivingSlugs } from "@/data/arriving-soon";
import type { Product } from "./types";
import { isSoldLocally } from "./utils";

/** Pure filtering/sorting shared by server pages. Everything lives in the URL. */
export interface ProductQuery {
  q: string;
  category: string;
  type: string;
  sport: string;
  tech: string;
  min: number | null;
  max: number | null;
  stock: boolean;
  sort: SortKey;
  page: number;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";

export const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
  { value: "newest", label: "Newest" },
];

export const PAGE_SIZE = 12;

export const PRICE_BANDS = [
  { id: "under-5k", label: "Under Rs. 5,000", min: null, max: 5000 },
  { id: "5k-30k", label: "Rs. 5,000 – 30,000", min: 5000, max: 30000 },
  { id: "30k-50k", label: "Rs. 30,000 – 50,000", min: 30000, max: 50000 },
  { id: "over-50k", label: "Over Rs. 50,000", min: 50000, max: null },
] as const;

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const num = (v: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);

export function parseQuery(sp: Raw, fixedCategory?: string): ProductQuery {
  const sort = one(sp.sort) as SortKey;
  return {
    q: one(sp.q).trim().slice(0, 80),
    category: fixedCategory ?? one(sp.category),
    type: one(sp.type),
    sport: one(sp.sport),
    tech: one(sp.tech),
    min: num(one(sp.min)),
    max: num(one(sp.max)),
    stock: one(sp.stock) === "1",
    sort: SORTS.some((s) => s.value === sort) ? sort : "featured",
    page: Math.max(1, Number.parseInt(one(sp.page) || "1", 10) || 1),
  };
}

export function matchesSearch(p: Product, q: string) {
  if (!q) return true;
  const hay = `${p.name} ${p.type} ${p.category} ${p.tags.join(" ")} ${p.shortDescription}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

export function applyQuery(products: Product[], query: ProductQuery) {
  let list = products.filter(
    (p) =>
      (!query.category || p.category === query.category) &&
      (!query.type || p.type === query.type) &&
      (!query.sport || p.sport === query.sport || p.sport === "all") &&
      (!query.tech || p.technologies.includes(query.tech)) &&
      ((query.min == null && query.max == null) ||
        (isSoldLocally(p) && (query.min == null || p.price >= query.min) && (query.max == null || p.price <= query.max))) &&
      (!query.stock || p.inStock) &&
      matchesSearch(p, query.q),
  );
  list = [...list].sort((a, b) => {
    if (query.sort.startsWith("price") && isSoldLocally(a) !== isSoldLocally(b)) return isSoldLocally(a) ? -1 : 1;
    switch (query.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      default:
        return (
          Number(b.inStock) - Number(a.inStock) ||
          Number(arrivingSlugs.has(b.slug)) - Number(arrivingSlugs.has(a.slug)) ||
          Number(isSoldLocally(b)) - Number(isSoldLocally(a)) ||
          (a.featuredRank ?? 99) - (b.featuredRank ?? 99) ||
          b.price - a.price
        );
    }
  });
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pages);
  return { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, pages, page };
}

import { arrivingSlugs, arrivingSoon } from "@/data/arriving-soon";
import { athletes } from "@/data/athletes";
import { categories } from "@/data/categories";
import { articles } from "@/data/news";
import { samplePlayer, sponsorships } from "@/data/sponsorships";
import { technologies } from "@/data/technologies";
import type { Academy, Article, ArticleBlock, Category, CategorySlug, CategoryTile, ImageRef, Product, SponsoredPlayer } from "./types";
import { isSoldLocally, readingTime } from "./utils";

export function getCategories() {
  return categories;
}

export function getStockedCategories() {
  return categories.filter((c) => !c.comingSoon);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}

export function getTechnologies() {
  return technologies;
}

export function getTechnology(slug: string) {
  return technologies.find((t) => t.slug === slug);
}

export function getTechnologiesBySlugs(slugs: string[]) {
  return slugs.map((s) => getTechnology(s)).filter((t): t is NonNullable<typeof t> => Boolean(t));
}

export function getAthletes() {
  return athletes;
}

export function getArticles(): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

function blockText(b: ArticleBlock) {
  switch (b.type) {
    case "paragraph":
    case "heading":
      return b.text;
    case "list":
      return b.items.join(" ");
    case "quote":
      return b.text;
    case "callout":
      return `${b.title} ${b.text}`;
    default:
      return "";
  }
}

export function articleReadingTime(a: Article) {
  return readingTime(a.blocks.map(blockText).join(" "));
}

export function getSponsorships() {
  return sponsorships;
}

export function getSponsorship(slug: string) {
  return sponsorships.find((s) => s.slug === slug);
}

export function getAcademies() {
  return sponsorships.filter((s): s is Academy => s.kind === "academy");
}

export function getSponsoredPlayers() {
  return sponsorships.filter((s): s is SponsoredPlayer => s.kind === "player");
}

export function getFeaturedSponsoredPlayer() {
  return samplePlayer;
}

/** On the latest Diadem order and on its way to United Sports (src/data/arriving-soon.ts). */
export function isArrivingSoon(p: { slug: string }) {
  return arrivingSlugs.has(p.slug);
}

/** The incoming rackets, each with its product page when that product is published. */
export function getArrivingSoon(products: Product[]) {
  return arrivingSoon.map((racket) => ({ racket, product: products.find((p) => p.slug === racket.productSlug) }));
}

export type TilePhoto = ImageRef & { fit: CategoryTile["fit"]; productSlug: string };

/** Products in a category that United Sports sells and has in stock (with a photo). */
export function availableInCategory(slug: string, products: Product[]) {
  return products
    .filter((p) => p.category === slug && isSoldLocally(p) && p.inStock && p.images.length > 0)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99) || b.price - a.price);
}

/**
 * Photo for a home category tile, always taken from a product that is available on the
 * retailer's store. Uses the category's preferred product/photo while it is in stock,
 * otherwise the first available product. Returns null when nothing is available.
 */
export function categoryTilePhoto(c: Category, products: Product[]): TilePhoto | null {
  const available = availableInCategory(c.slug, products);
  if (!available.length) return null;
  const preferred = c.tile ? available.find((p) => p.slug === c.tile!.productSlug) : undefined;
  if (preferred && c.tile && preferred.images[c.tile.image]) {
    const img = preferred.images[c.tile.image];
    return { src: c.tile.local ?? img.src, alt: img.alt || preferred.name, fit: c.tile.fit, productSlug: preferred.slug };
  }
  const p = preferred ?? available[0];
  return { src: p.images[0].src, alt: p.images[0].alt || p.name, fit: "contain", productSlug: p.slug };
}

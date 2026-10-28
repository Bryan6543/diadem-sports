import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getArticles, getCategories, getSponsorships } from "@/lib/catalog";
import { getProducts } from "@/lib/products";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${site.url}${p}`;
  const now = new Date();
  const products = await getProducts();
  return [
    ...["/", "/products", "/technologies", "/diadem", "/athletes", "/sponsorship", "/news", "/about", "/contact", "/privacy", "/terms"].map(
      (p) => ({ url: u(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 }),
    ),
    ...getCategories().map((c) => ({ url: u(`/category/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: u(`/products/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 1).map((i) => i.src),
    })),
    ...getArticles().map((a) => ({ url: u(`/news/${a.slug}`), lastModified: new Date(a.date), changeFrequency: "monthly" as const, priority: 0.6 })),
    // Partner and sponsored-player pages (sample pages are noindex but still listed for completeness once real).
    ...getSponsorships()
      .filter((s) => !s.isSample)
      .map((s) => ({ url: u(`/sponsorship/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}

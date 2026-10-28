import { NextResponse } from "next/server";
import { seedProducts } from "@/data/products";
import { toCsv } from "@/lib/csv";
import { getAdminSession } from "@/lib/server/admin-auth";
import { dbListProducts } from "@/lib/server/products-db";

export const dynamic = "force-dynamic";

/** Exports all products in the site's CSV template (re-importable). */
export async function GET() {
  if (!(await getAdminSession())) return new NextResponse("Unauthorised", { status: 401 });
  const products = (await dbListProducts().catch(() => null)) ?? seedProducts;
  const header = [
    "id", "slug", "name", "category", "type", "sport", "price", "compare_at_price", "in_stock", "published", "featured", "featured_rank",
    "spotlight", "retailer_handle", "retailer_url", "short_description", "description", "features", "specs", "included", "ideal_for",
    "technologies", "variants", "images", "image_alts", "tags",
  ];
  const j = (a: string[]) => a.join(" | ");
  const rows = products.map((p) => [
    p.id, p.slug, p.name, p.category, p.type, p.sport, p.price, p.compareAtPrice ?? "", p.inStock, p.published, p.featured, p.featuredRank ?? "",
    p.spotlight, p.retailerHandle, p.retailerUrl, p.shortDescription, j(p.description), j(p.features),
    j(p.specs.map((s) => `${s.label}: ${s.value}`)), j(p.included), j(p.idealFor), j(p.technologies),
    j(p.variants.map((v) => (v.available ? v.name : `${v.name} (sold out)`))), j(p.images.map((i) => i.src)), j(p.images.map((i) => i.alt)), j(p.tags),
  ]);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(header, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="diadem-products-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

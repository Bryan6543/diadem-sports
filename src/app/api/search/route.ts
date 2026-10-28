import { NextResponse, type NextRequest } from "next/server";
import { isArrivingSoon } from "@/lib/catalog";
import { matchesSearch } from "@/lib/product-query";
import { getFeaturedProducts, getProducts } from "@/lib/products";
import { isSoldLocally } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  const source = q ? (await getProducts()).filter((p) => matchesSearch(p, q)) : await getFeaturedProducts(6);
  const results = source.slice(0, 8).map((p) => ({
    slug: p.slug,
    name: p.name,
    type: p.type,
    price: p.price,
    inStock: p.inStock,
    local: isSoldLocally(p),
    arriving: isArrivingSoon(p),
    image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : null,
  }));
  return NextResponse.json({ results }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
}

import { NextResponse, type NextRequest } from "next/server";
import { getProductsBySlugs } from "@/lib/products";

/** Product cards for client-side lists (wishlist). GET /api/products?slugs=a,b,c */
export async function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 60);
  const products = await getProductsBySlugs(slugs);
  return NextResponse.json({ products }, { headers: { "Cache-Control": "public, max-age=60" } });
}

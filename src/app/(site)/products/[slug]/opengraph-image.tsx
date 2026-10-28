import { isArrivingSoon } from "@/lib/catalog";
import { getProduct } from "@/lib/products";
import { formatPrice, isSoldLocally } from "@/lib/utils";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Diadem product";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return renderOg({ eyebrow: "Diadem Sri Lanka", title: "Product not found" });
  return renderOg({
    eyebrow: p.type,
    title: p.name.replace(/^Diadem\s+/i, ""),
    subtitle: isSoldLocally(p) ? formatPrice(p.price) : isArrivingSoon(p) ? "Arriving soon at United Sports" : "Diadem global range",
    image: p.images[0]?.src,
  });
}

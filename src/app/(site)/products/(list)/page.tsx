import type { Metadata } from "next";
import { CollectionHero } from "@/components/product/collection-hero";
import { ProductBrowser } from "@/components/product/product-browser";
import { parseQuery } from "@/lib/product-query";
import { getProducts } from "@/lib/products";
import { getSiteImageOverride } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "All Diadem products",
  description: "Browse every Diadem tennis racket, pickleball paddle, string, shoe and accessory available in Sri Lanka from United Sports.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [sp, products, banner] = await Promise.all([searchParams, getProducts(), getSiteImageOverride("collection.all")]);
  const query = parseQuery(sp);
  return (
    <>
      <CollectionHero
        eyebrow={`${products.length} products`}
        title="All products"
        intro="Every Diadem product stocked by United Sports in Sri Lanka. Filter, compare, then buy on unitedsports.lk."
        outline="Diadem"
        background={banner}
        image={{ src: "/images/brand/axis-on-court.jpg", alt: "A player sitting at the net with a Diadem racket and tennis balls" }}
        position="65% 40%"
        crumbs={[{ label: "Products", href: "/products" }]}
      />
      <div className="container-x py-10 lg:py-14">
        <ProductBrowser products={products} query={query} basePath="/products" />
      </div>
    </>
  );
}

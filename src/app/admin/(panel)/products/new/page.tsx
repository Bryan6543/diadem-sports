import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { site } from "@/data/site";
import { getCategories, getTechnologies } from "@/lib/catalog";
import { requireAdmin } from "@/lib/server/admin-auth";
import { hasSupabase } from "@/lib/server/env";
import type { Product } from "@/lib/types";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  if (!hasSupabase()) redirect("/admin/products");
  const blank: Product = {
    id: `p-${randomUUID().slice(0, 8)}`,
    slug: "",
    name: "",
    category: "tennis-rackets",
    type: "",
    sport: "tennis",
    shortDescription: "",
    description: [],
    features: [],
    specs: [],
    included: [],
    idealFor: [],
    technologies: [],
    price: 0,
    compareAtPrice: null,
    inStock: true,
    variants: [],
    images: [],
    retailerHandle: "",
    retailerUrl: "",
    featured: false,
    featuredRank: null,
    spotlight: false,
    published: false,
    tags: ["diadem"],
  };
  return <ProductEditor initial={blank} isNew categories={getCategories()} technologies={getTechnologies()} storeHost={site.retailer.host} />;
}

import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { site } from "@/data/site";
import { getCategories, getTechnologies } from "@/lib/catalog";
import { requireAdmin } from "@/lib/server/admin-auth";
import { dbGetProduct } from "@/lib/server/products-db";

export const metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await dbGetProduct(decodeURIComponent(id));
  if (!product) notFound();
  return (
    <ProductEditor key={product.updatedAt ?? product.id} initial={product} isNew={false} categories={getCategories()} technologies={getTechnologies()} storeHost={site.retailer.host} />
  );
}

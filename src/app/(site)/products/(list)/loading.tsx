import { ProductCardSkeleton } from "@/components/product/product-card";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="h-80 bg-ink" />
      <div className="container-x py-10 lg:py-14">
        <div className="skeleton h-14 w-full" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

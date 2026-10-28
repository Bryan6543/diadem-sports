"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { buttonClass } from "@/components/ui/primitives";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/lib/wishlist";

export function WishlistView() {
  const { items, clear } = useWishlist();
  const [products, setProducts] = useState<Product[] | null>(null);
  const key = items.join(",");

  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    fetch(`/api/products?slugs=${encodeURIComponent(key)}`, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<{ products: Product[] }>)
      .then((d) => setProducts(d.products))
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]);

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-4xl">Nothing saved yet</p>
        <p className="mt-3 text-body">Tap the heart on any product to save it here.</p>
        <Link href="/products" className={buttonClass("dark", "mt-8")}>
          Explore products
        </Link>
      </div>
    );
  }

  const visible = products?.filter((p) => items.includes(p.slug)) ?? null;
  return (
    <>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="text-sm text-muted" aria-live="polite">
          {items.length} saved item{items.length === 1 ? "" : "s"}
        </p>
        <button type="button" onClick={clear} className="text-sm font-semibold text-brand-deep underline underline-offset-4">
          Clear wishlist
        </button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {visible
          ? visible.map((p) => <ProductCard key={p.id} product={p} />)
          : items.map((s) => <ProductCardSkeleton key={s} />)}
      </div>
    </>
  );
}

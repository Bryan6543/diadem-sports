import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Stagger } from "@/animations/motion";
import { getCategories, getTechnologies } from "@/lib/catalog";
import { applyQuery, type ProductQuery } from "@/lib/product-query";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Filters } from "./filters";
import { ProductCard } from "./product-card";

/** Server-rendered product listing. Filters live in the URL so every view is shareable. */
export function ProductBrowser({
  products,
  query,
  basePath,
  fixedCategory,
}: {
  products: Product[];
  query: ProductQuery;
  basePath: string;
  fixedCategory?: boolean;
}) {
  const { items, total, pages, page } = applyQuery(products, query);
  const scope = query.category ? products.filter((p) => p.category === query.category) : products;
  const count = (fn: (p: Product) => boolean) => products.filter(fn).length;

  const categoryOptions = getCategories()
    .filter((c) => !c.comingSoon)
    .map((c) => ({ value: c.slug, label: c.name, count: count((p) => p.category === c.slug) }));
  const typeOptions = query.category
    ? [...new Set(scope.map((p) => p.type))].map((t) => ({ value: t, label: t, count: scope.filter((p) => p.type === t).length }))
    : [];
  const techOptions = getTechnologies()
    .map((t) => ({ value: t.slug, label: t.name, count: scope.filter((p) => p.technologies.includes(t.slug)).length }))
    .filter((t) => t.count > 0);

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({
      q: query.q,
      category: fixedCategory ? "" : query.category,
      type: query.type,
      sport: query.sport,
      tech: query.tech,
      min: query.min ?? "",
      max: query.max ?? "",
      stock: query.stock ? "1" : "",
      sort: query.sort === "featured" ? "" : query.sort,
    })) {
      if (v !== "" && v != null) p.set(k, String(v));
    }
    if (n > 1) p.set("page", String(n));
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div>
      <Filters
        query={query}
        fixedCategory={fixedCategory}
        categories={categoryOptions}
        types={typeOptions}
        technologies={techOptions}
        total={total}
      />
      {items.length ? (
        <Stagger key={`${page}-${items.map((p) => p.id).join()}`} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <div key={p.id} data-stagger>
              <ProductCard product={p} priority={i < 4} />
            </div>
          ))}
        </Stagger>
      ) : (
        <div className="py-24 text-center">
          <p className="font-display text-4xl">No matches</p>
          <p className="mt-3 text-body">Try removing a filter or searching for something else.</p>
          <Link href={basePath} className="mt-6 inline-block font-semibold text-brand-deep underline underline-offset-4">
            Clear all filters
          </Link>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-1">
          <PageLink href={pageHref(page - 1)} disabled={page <= 1} label="Previous page">
            <ChevronLeft aria-hidden className="size-4" />
          </PageLink>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              scroll
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "grid size-11 place-items-center font-mono text-sm",
                n === page ? "bg-ink text-white" : "hover:bg-mist",
              )}
            >
              {n}
            </Link>
          ))}
          <PageLink href={pageHref(page + 1)} disabled={page >= pages} label="Next page">
            <ChevronRight aria-hidden className="size-4" />
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span aria-disabled className="grid size-11 place-items-center text-muted/50">
        {children}
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <Link href={href} className="grid size-11 place-items-center hover:bg-mist" aria-label={label}>
      {children}
    </Link>
  );
}

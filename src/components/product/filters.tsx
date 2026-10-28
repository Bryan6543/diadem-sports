"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { PRICE_BANDS, SORTS, type ProductQuery } from "@/lib/product-query";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  query: ProductQuery;
  fixedCategory?: boolean;
  categories: Option[];
  types: Option[];
  technologies: Option[];
  total: number;
}

const toParams = (q: ProductQuery, fixedCategory?: boolean) => {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.category && !fixedCategory) p.set("category", q.category);
  if (q.type) p.set("type", q.type);
  if (q.sport) p.set("sport", q.sport);
  if (q.tech) p.set("tech", q.tech);
  if (q.min != null) p.set("min", String(q.min));
  if (q.max != null) p.set("max", String(q.max));
  if (q.stock) p.set("stock", "1");
  if (q.sort !== "featured") p.set("sort", q.sort);
  if (q.page > 1) p.set("page", String(q.page));
  return p;
};

export function Filters({ query, fixedCategory, categories, types, technologies, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const [search, setSearch] = useState(query.q);
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (patch: Partial<ProductQuery>) => {
    const next = { ...query, ...patch, page: patch.page ?? 1 };
    if ("category" in patch) next.type = "";
    const qs = toParams(next, fixedCategory).toString();
    start(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const band = PRICE_BANDS.find((b) => b.min === query.min && b.max === query.max)?.id ?? "";
  const activeCount =
    [query.type, query.sport, query.tech, band, query.q, fixedCategory ? "" : query.category].filter(Boolean).length +
    (query.stock ? 1 : 0);

  const select = "h-11 w-full border border-ink/20 bg-white px-3 text-sm focus:border-brand-deep focus:outline-none";
  const label = "eyebrow mb-2 block text-muted";

  return (
    <div className="border-y border-line py-4">
      <div className="flex flex-wrap items-center gap-3">
        <form
          role="search"
          className="flex h-11 min-w-0 flex-1 items-center border border-ink/20 focus-within:border-brand-deep sm:max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search.trim() });
          }}
        >
          <label htmlFor="filter-q" className="sr-only">
            Search within products
          </label>
          <Search aria-hidden className="ml-3 size-4 shrink-0 text-muted" />
          <input
            id="filter-q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm focus:outline-none"
          />
          {search && (
            <button
              type="button"
              className="grid size-10 place-items-center text-muted hover:text-ink"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                update({ q: "" });
              }}
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="filter-panel"
          className="inline-flex h-11 items-center gap-2 border border-ink/20 px-4 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal aria-hidden className="size-4" /> Filters{activeCount ? ` (${activeCount})` : ""}
        </button>

        <div className="ml-auto flex items-center gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {pending ? <Loader2 aria-label="Updating" className="size-4 animate-spin" /> : `${total} product${total === 1 ? "" : "s"}`}
          </p>
          <label htmlFor="filter-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="filter-sort"
            value={query.sort}
            onChange={(e) => update({ sort: e.target.value as ProductQuery["sort"] })}
            className="h-11 border border-ink/20 bg-white px-3 text-sm focus:border-brand-deep focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        id="filter-panel"
        className={cn("mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid lg:grid-cols-5", mobileOpen ? "grid" : "hidden")}
      >
        {!fixedCategory && (
          <div>
            <label htmlFor="f-category" className={label}>
              Collection
            </label>
            <select id="f-category" className={select} value={query.category} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All collections</option>
              {categories.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                  {o.count != null ? ` (${o.count})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="f-type" className={label}>
            Type
          </label>
          <select
            id="f-type"
            className={select}
            value={query.type}
            onChange={(e) => update({ type: e.target.value })}
            disabled={!types.length}
          >
            <option value="">{types.length ? "All types" : "Choose a collection"}</option>
            {types.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
                {o.count != null ? ` (${o.count})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-price" className={label}>
            Price
          </label>
          <select
            id="f-price"
            className={select}
            value={band}
            onChange={(e) => {
              const b = PRICE_BANDS.find((x) => x.id === e.target.value);
              update({ min: b?.min ?? null, max: b?.max ?? null });
            }}
          >
            <option value="">Any price</option>
            {PRICE_BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-tech" className={label}>
            Technology
          </label>
          <select id="f-tech" className={select} value={query.tech} onChange={(e) => update({ tech: e.target.value })}>
            <option value="">Any technology</option>
            {technologies.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
                {o.count != null ? ` (${o.count})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className={cn(fixedCategory && "lg:col-span-2")}>
          <span className={label}>Availability</span>
          <div className="flex h-11 items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={query.stock}
                onChange={(e) => update({ stock: e.target.checked })}
                className="size-4 accent-[var(--color-brand-deep)]"
              />
              In stock only
            </label>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  start(() => router.push(pathname, { scroll: false }));
                }}
                className="text-sm font-semibold text-brand-deep underline underline-offset-4"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { NavGroup } from "./nav-data";

interface Hit {
  slug: string;
  name: string;
  type: string;
  price: number;
  inStock: boolean;
  local: boolean;
  arriving: boolean;
  image: { src: string; alt: string } | null;
}

export function SearchOverlay({ open, onClose, collections }: { open: boolean; onClose: () => void; collections: NavGroup[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (res.ok) setHits(((await res.json()) as { results: Hit[] }).results);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 160);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [q, open]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-[70] overflow-y-auto bg-ink/97 text-white backdrop-blur-sm animate-fade-in"
    >
      <div className="container-x py-6 sm:py-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-brand-bright">Search Diadem</p>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center hover:text-brand-bright" aria-label="Close search">
            <X aria-hidden className="size-6" />
          </button>
        </div>
        <form
          role="search"
          action="/products"
          className="mt-6 flex items-center gap-4 border-b-2 border-white/30 pb-3 focus-within:border-brand-bright"
        >
          <Search aria-hidden className="size-7 shrink-0 text-white/50" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            name="q"
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rackets, paddles, strings…"
            autoComplete="off"
            className="font-display w-full bg-transparent text-4xl text-white placeholder:text-white/25 focus:outline-none sm:text-6xl"
          />
          {loading && <Loader2 aria-hidden className="size-5 shrink-0 animate-spin text-white/50" />}
        </form>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem]">
          <div>
            <p className="eyebrow text-white/50" aria-live="polite">
              {q.trim() ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : "Popular right now"}
            </p>
            <ul className="mt-4 divide-y divide-white/10">
              {hits.map((h) => (
                <li key={h.slug}>
                  <Link href={`/products/${h.slug}`} className="group flex items-center gap-4 py-3">
                    <span className="relative size-16 shrink-0 overflow-hidden bg-white">
                      {h.image && <Image src={h.image.src} alt="" fill sizes="64px" className="object-contain p-1" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold group-hover:text-brand-bright">{h.name}</span>
                      <span className="eyebrow mt-1 block text-white/50">
                        {h.type}
                        {h.arriving ? (h.local ? " · New stock arriving" : " · Arriving soon") : h.local ? !h.inStock && " · Sold out" : " · Global range"}
                      </span>
                    </span>
                    {h.local && <span className="font-mono text-sm">{formatPrice(h.price)}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            {q.trim() && (
              <Link
                href={`/products?q=${encodeURIComponent(q.trim())}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand-bright hover:text-white"
              >
                See all results <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
          <div>
            <p className="eyebrow text-white/50">Collections</p>
            <ul className="mt-4 space-y-1">
              {collections.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="font-display block py-1.5 text-2xl hover:text-brand-bright">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

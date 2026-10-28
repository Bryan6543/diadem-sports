"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { NavGroup, NavLink } from "./nav-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  collections: NavGroup[];
  discover: NavLink[];
  shopHref: string;
  retailerName: string;
}

export function MobileMenu({ open, onClose, onSearch, collections, discover, shopHref, retailerName }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-white animate-fade-in"
    >
      <div className="container-x flex h-16 shrink-0 items-center justify-between border-b border-white/10">
        <Link href="/" onClick={onClose} aria-label="Diadem Sri Lanka — home">
          <Logo />
        </Link>
        <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label="Close menu">
          <X aria-hidden className="size-6" />
        </button>
      </div>
      <nav aria-label="Mobile" className="container-x flex-1 py-6">
        <button
          type="button"
          onClick={onSearch}
          className="mb-6 flex h-12 w-full items-center gap-3 border border-white/25 px-4 text-left text-white/70"
        >
          <Search aria-hidden className="size-5" /> Search products…
        </button>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {collections.map((g) => {
            const isOpen = expanded === g.href;
            const panelId = `m-${g.href.replace(/[^a-z0-9]/gi, "")}`;
            return (
              <li key={g.href}>
                <button
                  type="button"
                  className="font-display flex w-full items-center justify-between py-4 text-3xl"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : g.href)}
                >
                  {g.label}
                  <ChevronDown aria-hidden className={cn("size-5 transition-transform", isOpen && "rotate-180")} />
                </button>
                <ul id={panelId} hidden={!isOpen} className="pb-4">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={onClose} className="block py-2 pl-1 text-white/75 hover:text-brand-bright">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="eyebrow mt-8 text-brand-bright">Discover</p>
        <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          {discover.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onClose} className="block py-2.5 text-lg font-semibold hover:text-brand-bright">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/wishlist" onClick={onClose} className="block py-2.5 text-lg font-semibold hover:text-brand-bright">
              Wishlist
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={onClose} className="block py-2.5 text-lg font-semibold hover:text-brand-bright">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="container-x shrink-0 border-t border-white/10 py-5">
        <a
          href={shopHref}
          target="_blank"
          rel="noopener"
          className="flex h-12 w-full items-center justify-center gap-2 border border-white text-sm font-bold uppercase tracking-[0.14em] hover:bg-white hover:text-ink"
        >
          Shop {retailerName} <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

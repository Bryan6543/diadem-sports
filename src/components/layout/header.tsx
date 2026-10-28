"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Heart, Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";
import { MobileMenu } from "./mobile-menu";
import type { NavGroup, NavLink } from "./nav-data";
import { SearchOverlay } from "./search-overlay";

interface Props {
  collections: NavGroup[];
  discover: NavLink[];
  shopHref: string;
  retailerName: string;
}

export function Header({ collections, discover, shopHref, retailerName }: Props) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useWishlist();
  const lastY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY.current) < 6) return;
      setHidden(y > lastY.current && y > 160);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // "/" and Ctrl/Cmd+K open search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close dropdowns when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b text-white transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]",
          scrolled ? "border-white/10 bg-ink/95 backdrop-blur-md" : "border-transparent bg-ink",
          hidden && !open && !searchOpen && !menuOpen && "-translate-y-full",
        )}
      >
        <div className="container-x flex h-16 items-center gap-4 xl:h-[4.5rem]">
          <Link href="/" className="shrink-0" aria-label="Diadem Sri Lanka — home">
            <Logo />
          </Link>

          <nav ref={navRef} aria-label="Main" className="ml-2 hidden xl:block 2xl:ml-4">
            <ul className="flex items-center">
              {collections.map((g) => (
                <Dropdown
                  key={g.href}
                  id={g.href}
                  label={g.label}
                  active={isActive(g.href)}
                  open={open === g.href}
                  setOpen={setOpen}
                >
                  <ul className="min-w-56 py-2">
                    {g.links.map((l, i) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className={cn(
                            "block px-5 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-brand-bright",
                            i === 0 && "font-semibold",
                          )}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Dropdown>
              ))}
              <Dropdown id="discover" label="Discover" open={open === "discover"} setOpen={setOpen} wide>
                <ul className="grid w-[34rem] grid-cols-2 gap-1 p-3">
                  {discover.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group block px-3 py-2.5 transition-colors hover:bg-white/5">
                        <span className="block text-sm font-semibold group-hover:text-brand-bright">{l.label}</span>
                        {l.description && <span className="mt-0.5 block text-xs text-white/55">{l.description}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Dropdown>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 items-center gap-2.5 border border-white/25 px-3 text-left text-sm text-white/60 transition-colors hover:border-white/60 hover:text-white lg:flex lg:w-52 xl:max-2xl:w-auto 2xl:w-60"
              aria-label="Search products"
              aria-keyshortcuts="/ Control+K Meta+K"
            >
              <Search aria-hidden className="size-4 shrink-0" />
              <span className="flex-1 whitespace-nowrap xl:max-2xl:sr-only">Search products…</span>
              <kbd className="border border-white/25 px-1.5 font-mono text-[0.65rem] leading-5 text-white/60">/</kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center hover:text-brand-bright lg:hidden"
              aria-label="Search products"
            >
              <Search aria-hidden className="size-5" />
            </button>
            <Link
              href="/wishlist"
              className="relative grid size-10 place-items-center transition-colors hover:text-brand-bright"
              aria-label={`Wishlist (${count} ${count === 1 ? "item" : "items"})`}
            >
              <Heart aria-hidden className="size-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-4.5 place-items-center bg-brand-bright px-1 font-mono text-[0.6rem] font-bold leading-4.5 text-ink">
                  {count}
                </span>
              )}
            </Link>
            <a
              href={shopHref}
              target="_blank"
              rel="noopener"
              className="hidden h-10 items-center gap-1.5 whitespace-nowrap border border-white bg-ink px-3.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-white hover:text-ink md:inline-flex"
            >
              Shop {retailerName}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center hover:text-brand-bright xl:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} collections={collections} />
      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        collections={collections}
        discover={discover}
        shopHref={shopHref}
        retailerName={retailerName}
        onSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}

function Dropdown({
  id,
  label,
  active,
  open,
  setOpen,
  wide,
  children,
}: {
  id: string;
  label: string;
  active?: boolean;
  open: boolean;
  setOpen: (v: string | null) => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const panelId = `menu-${id.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <li className="relative" onMouseEnter={() => setOpen(id)} onMouseLeave={() => setOpen(null)}>
      <button
        type="button"
        className={cn(
          "flex h-[4.5rem] items-center gap-1 whitespace-nowrap px-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.07em] transition-colors hover:text-brand-bright 2xl:px-4 2xl:text-[0.8rem] 2xl:tracking-[0.1em]",
          (active || open) && "text-brand-bright",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(open ? null : id)}
      >
        {label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn("absolute top-full border border-white/10 bg-ink-2 shadow-2xl", wide ? "right-0 xl:-right-24" : "left-0")}
      >
        {children}
      </div>
    </li>
  );
}

"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "ds-wishlist";
const EVENT = "ds-wishlist-change";
const EMPTY: string[] = [];
let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value;
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const value = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : EMPTY;
    cache = { raw, value };
    return value;
  } catch {
    return EMPTY;
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — wishlist simply won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  // "storage" fires in other tabs, keeping every open tab in sync.
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, cb);
  };
}

export function useWishlist() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const list = read();
    write(list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
  }, []);
  const remove = useCallback((slug: string) => write(read().filter((s) => s !== slug)), []);
  const clear = useCallback(() => write([]), []);
  return { items, has: (slug: string) => items.includes(slug), toggle, remove, clear, count: items.length };
}

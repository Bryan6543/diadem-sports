"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { NewsletterForm } from "./newsletter-form";

const KEY = "ds-newsletter-popup";
const DELAY_MS = 25_000;
const SNOOZE_DAYS = 14;

/** Timed newsletter invitation. Shown once per 14 days, never on admin/legal pages. */
export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);
  useFocusTrap(ref, open, dismiss);

  useEffect(() => {
    if (/^\/(admin|unsubscribe|privacy|terms)/.test(pathname)) return;
    try {
      const last = Number(localStorage.getItem(KEY) ?? 0);
      if (Date.now() - last < SNOOZE_DAYS * 864e5) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-ink/60 p-4 sm:place-items-center animate-fade-in" onClick={dismiss}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="relative w-full max-w-md bg-ink p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={dismiss} className="absolute right-3 top-3 grid size-10 place-items-center hover:text-brand-bright" aria-label="Close">
          <X aria-hidden className="size-5" />
        </button>
        <p className="eyebrow text-brand-bright">Stay in the game</p>
        <h2 id="popup-title" className="font-display mt-3 text-5xl">
          New gear. First.
        </h2>
        <p className="mt-3 text-white/70">New Diadem arrivals, restocks and stories from Sri Lanka&apos;s courts — a few emails a month.</p>
        <NewsletterForm source="popup" tone="light" withName className="mt-6" onSuccess={() => window.setTimeout(dismiss, 2500)} />
      </div>
    </div>
  );
}

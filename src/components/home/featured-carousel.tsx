"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Horizontal scroll-snap carousel with prev/next buttons. Children are the slides. */
export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mb-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="grid size-12 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-white"
          aria-label="Scroll left"
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="grid size-12 place-items-center border border-ink/20 transition-colors hover:bg-ink hover:text-white"
          aria-label="Scroll right"
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      >
        {children}
      </ul>
    </div>
  );
}

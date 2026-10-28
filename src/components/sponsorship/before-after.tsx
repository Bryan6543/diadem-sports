"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import type { ImageRef } from "@/lib/types";

/** Before/after comparison. A native range input drives it, so it works with keyboard, mouse and touch. */
export function BeforeAfter({ before, after, label = "Before and after comparison" }: { before: ImageRef; after: ImageRef; label?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="relative">
      <div className="relative aspect-[16/10] select-none overflow-hidden bg-ink">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        </div>
        <span className="eyebrow pointer-events-none absolute left-4 top-4 bg-ink/80 px-2 py-1 text-white">Before</span>
        <span className="eyebrow pointer-events-none absolute right-4 top-4 bg-brand-deep px-2 py-1 text-white">After</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg">
            <ChevronsLeftRight className="size-5" />
          </span>
        </div>
        <label htmlFor={id} className="sr-only">
          {label}: drag to compare. Left shows before, right shows after.
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${pos}% before`}
          className="ba-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">Drag the handle, or use the arrow keys, to compare.</figcaption>
    </figure>
  );
}

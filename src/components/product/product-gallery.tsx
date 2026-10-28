"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ImageRef[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) {
    return <div className="grid aspect-[4/5] place-items-center bg-mist text-muted">Photos coming soon</div>;
  }
  const go = (d: number) => setActive((i) => (i + d + images.length) % images.length);
  const current = images[active];

  return (
    <div className="lg:sticky lg:top-24">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-mist"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          preload={active === 0}
          loading="eager"
          className="object-cover animate-fade-in"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-white/90 hover:bg-ink hover:text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-white/90 hover:bg-ink hover:text-white"
              aria-label="Next photo"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
            <p className="eyebrow absolute bottom-3 right-3 bg-ink px-2 py-1 text-white" aria-live="polite">
              {active + 1} / {images.length}
            </p>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" aria-label="Choose a photo">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block size-20 overflow-hidden border-2 bg-mist transition-colors",
                  i === active ? "border-brand-deep" : "border-transparent hover:border-ink/30",
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

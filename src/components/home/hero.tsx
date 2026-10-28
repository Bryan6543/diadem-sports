"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { gsap, reducedMotion, useGSAP } from "@/animations/gsap";
import { buttonClass } from "@/components/ui/primitives";
import type { HeroSlide } from "@/data/hero-slides";
import { cn, pad } from "@/lib/utils";

export interface ResolvedSlide extends HeroSlide {
  /** Live price text when the slide's product is sold by the retailer. */
  price?: string;
  buyHref?: string;
}

const INTERVAL = 7000;

/** Full-width home hero slider. The arriving-soon rackets lead; tennis rackets dominate the rotation. */
export function Hero({ slides, retailerName }: { slides: ResolvedSlide[]; retailerName: string }) {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

  const running = playing && !hovered && count > 1;
  useEffect(() => {
    // Respect reduced motion: never autoplay.
    if (!running || reducedMotion()) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  // Reveal the active slide's text.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const active = el.querySelector<HTMLElement>(`[data-slide="${index}"]`);
      const parts = active?.querySelectorAll<HTMLElement>("[data-slide-part]");
      gsap.set(el.querySelectorAll("[data-animate]"), { autoAlpha: 1 });
      if (!parts?.length || reducedMotion()) return;
      gsap.fromTo(parts, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", delay: 0.15 });
      const outline = active?.querySelector("[data-slide-outline]");
      if (outline) gsap.fromTo(outline, { autoAlpha: 0, xPercent: 6 }, { autoAlpha: 1, xPercent: 0, duration: 1.8, ease: "expo.out" });
    },
    { scope: root, dependencies: [index] },
  );

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate overflow-hidden bg-ink text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="relative h-[calc(100svh-6.25rem)] max-h-[56rem] min-h-[36rem]">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              data-slide={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-out-expo)]",
                active ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
            >
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                preload={i === 0}
                loading={i < 2 ? "eager" : "lazy"}
                sizes="100vw"
                quality={85}
                style={{ objectPosition: s.position ?? "center" }}
                className={cn(
                  "-z-20 object-cover transition-transform duration-[8000ms] ease-out",
                  active ? "scale-100" : "scale-110",
                )}
              />
              {s.lightBackdrop ? (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-ink/70 md:bg-transparent md:bg-gradient-to-r md:from-ink md:from-20% md:via-ink/70 md:via-40% md:to-transparent md:to-60%"
                  />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-t from-ink/80 to-transparent" />
                </>
              ) : (
                <>
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/5" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />
                </>
              )}

              <span
                data-slide-outline
                aria-hidden
                className="font-display hollow pointer-events-none absolute -bottom-[4vw] right-[-2vw] -z-10 select-none whitespace-nowrap text-[clamp(7rem,22vw,22rem)] leading-none text-white/20"
              >
                {s.outline}
              </span>

              <div className="container-x flex h-full flex-col justify-center pb-28 pt-10 sm:pb-32">
                <div className="max-w-2xl">
                  <p data-slide-part className="eyebrow text-brand-bright">
                    {pad(i + 1)} — {s.eyebrow}
                  </p>
                  {i === 0 ? (
                    <h1 data-slide-part className="font-display mt-5 text-[clamp(3.4rem,9vw,8.5rem)]">
                      {s.title}
                    </h1>
                  ) : (
                    <h2 data-slide-part className="font-display mt-5 text-[clamp(3.4rem,9vw,8.5rem)]">
                      {s.title}
                    </h2>
                  )}
                  {s.subtitle && (
                    <p data-slide-part className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-white">
                      {s.subtitle}
                    </p>
                  )}
                  <p data-slide-part className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                    {s.text}
                  </p>
                  {s.price && (
                    <p data-slide-part className="mt-4 font-mono text-2xl">
                      {s.price}
                    </p>
                  )}
                  <div data-slide-part className="mt-8 flex flex-wrap gap-3">
                    <Link href={s.cta.href} className={buttonClass("light")}>
                      {s.cta.label} <ArrowRight aria-hidden className="size-4" />
                    </Link>
                    {s.buyHref ? (
                      <a href={s.buyHref} target="_blank" rel="noopener" className={buttonClass("outline-light")}>
                        Buy on {retailerName} <ArrowUpRight aria-hidden className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      s.secondary && (
                        <Link href={s.secondary.href} className={buttonClass("outline-light")}>
                          {s.secondary.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink/50 backdrop-blur-sm">
          <div className="container-x flex items-stretch gap-2">
            <ol className="no-scrollbar flex flex-1 overflow-x-auto" aria-label="Choose a slide">
              {slides.map((s, i) => (
                <li key={s.id} className="min-w-28 flex-1 sm:min-w-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index ? "true" : undefined}
                    aria-label={`Show slide ${i + 1}: ${s.label}`}
                    className={cn(
                      "group relative block w-full py-4 pr-4 text-left transition-colors",
                      i === index ? "text-white" : "text-white/50 hover:text-white",
                    )}
                  >
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-white/15">
                      <span
                        key={i === index ? `${index}-${running}` : "idle"}
                        className={cn(
                          "block h-full bg-brand-bright",
                          i === index ? (running ? "w-full origin-left animate-[slide-progress_7s_linear]" : "w-full") : "w-0",
                        )}
                      />
                    </span>
                    <span className="font-mono text-[0.68rem]">{pad(i + 1)}</span>
                    <span className="ml-2 hidden text-xs font-semibold uppercase tracking-[0.12em] md:inline">{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="grid size-10 place-items-center text-white/70 hover:text-white"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              >
                {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="grid size-10 place-items-center border border-white/25 hover:border-white hover:bg-white hover:text-ink"
                aria-label="Previous slide"
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="grid size-10 place-items-center border border-white/25 hover:border-white hover:bg-white hover:text-ink"
                aria-label="Next slide"
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Stagger } from "@/animations/motion";
import { Price } from "@/components/product/price";
import { ButtonLink, OutlineWord, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getTechnologiesBySlugs } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { withReferral } from "@/lib/utils";

/** On-court photography per frame family (Diadem Sports). */
const SERIES: Record<string, { photo: string; alt: string; style: string; position?: string }> = {
  Axis: { photo: "/images/brand/axis-serve.jpg", alt: "A player holding a Diadem Axis racket and a ball", style: "Spin" },
  Nova: { photo: "/images/brand/nova-on-court.jpg", alt: "A Diadem Nova racket on court", style: "Easy power" },
  Elevate: { photo: "/images/brand/elevate-on-court.jpg", alt: "A Diadem Elevate racket on court", style: "Control" },
};

const SPEC_LABELS = /head size|string pattern|weight|balance/i;

/** The headline section: every tennis racket United Sports has in stock, one large card each. */
export function RacketShowcase({ rackets, total, index }: { rackets: Product[]; total: number; index: number }) {
  if (!rackets.length) return null;
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="rackets-title">
      <OutlineWord className="-right-6 top-4 text-white">Rackets</OutlineWord>
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Tennis rackets"
            index={index}
            tone="light"
            title={<span id="rackets-title">Find your frame</span>}
            intro={`Spin, easy power or control. These are the Diadem rackets ${site.retailer.name} has in stock right now.`}
          />
          <ButtonLink href="/category/tennis-rackets" variant="outline-light">
            All {total} tennis rackets <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {rackets.map((p) => {
            const series = SERIES[p.type];
            const specs = p.specs.filter((s) => SPEC_LABELS.test(s.label)).slice(0, 3);
            const tech = getTechnologiesBySlugs(p.technologies).slice(0, 3);
            return (
              <article key={p.id} data-stagger className="group relative flex flex-col bg-ink-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={series?.photo ?? p.images[1]?.src ?? p.images[0].src}
                    alt={series?.alt ?? p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />
                  {series && (
                    <span className="eyebrow absolute left-5 top-5 bg-brand-bright px-2.5 py-1 font-bold text-ink">For {series.style.toLowerCase()}</span>
                  )}
                  <span className="font-display absolute bottom-3 left-5 text-7xl">{p.type}</span>
                </div>
                <div className="flex flex-1 gap-5 p-5">
                  <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-white">
                    <Image src={p.images[0].src} alt={p.images[0].alt || p.name} fill sizes="96px" className="object-contain" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-semibold leading-snug">
                      <Link href={`/products/${p.slug}`} className="hover:text-brand-bright">
                        {p.name}
                      </Link>
                    </h3>
                    {specs.length > 0 && (
                      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        {specs.map((s) => (
                          <div key={s.label}>
                            <dt className="text-white/50">{s.label}</dt>
                            <dd className="mt-0.5 font-semibold">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {tech.length > 0 && <p className="mt-3 text-xs text-white/55">{tech.map((t) => t.name).join(" · ")}</p>}
                    <Price price={p.price} compareAt={p.compareAtPrice} tone="light" className="mt-auto pt-4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-white/10">
                  <Link href={`/products/${p.slug}`} className="flex h-12 items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-ink">
                    View details
                  </Link>
                  <a
                    href={withReferral(p.retailerUrl, `rackets-${p.slug}`)}
                    target="_blank"
                    rel="noopener"
                    className="flex h-12 items-center justify-center gap-1.5 bg-brand-deep text-xs font-bold uppercase tracking-[0.12em] hover:bg-brand-bright hover:text-ink"
                  >
                    Buy now <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">on {site.retailer.name} (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

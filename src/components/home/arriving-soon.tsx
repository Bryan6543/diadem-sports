import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Stagger } from "@/animations/motion";
import { Price } from "@/components/product/price";
import { ButtonLink, OutlineWord, SectionHeading } from "@/components/ui/primitives";
import type { ArrivingRacket } from "@/data/arriving-soon";
import { site } from "@/data/site";
import type { Product } from "@/lib/types";
import { isSoldLocally, withReferral } from "@/lib/utils";

/** The rackets on United Sports' latest Diadem order (src/data/arriving-soon.ts). Anchor: /#arriving-soon. */
export function ArrivingSoon({ items, index }: { items: { racket: ArrivingRacket; product?: Product }[]; index: number }) {
  if (!items.length) return null;
  return (
    <section id="arriving-soon" className="relative scroll-mt-24 overflow-hidden bg-brand-wash py-20 lg:py-28" aria-labelledby="arriving-title">
      <OutlineWord className="-right-6 top-4 text-brand-deep">Arriving</OutlineWord>
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Arriving soon"
            index={index}
            title={<span id="arriving-title">Fresh from Diadem</span>}
            intro={`Three Elevate control rackets from our latest Diadem order are on their way to ${site.retailer.name} stores in Sri Lanka.`}
          />
          <ButtonLink href="/contact" variant="outline">
            Ask the store <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map(({ racket: r, product: p }) => {
            const href = p ? `/products/${p.slug}` : undefined;
            const buy = p && isSoldLocally(p) && p.inStock ? withReferral(p.retailerUrl, `arriving-${p.slug}`) : undefined;
            return (
              <article key={r.productSlug} data-stagger className="group flex flex-col bg-white ring-1 ring-line">
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <Image
                    src={r.image.src}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain p-6 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <span className="eyebrow absolute left-4 top-4 bg-brand-bright px-2.5 py-1 font-bold text-ink">
                    New · Arriving soon
                  </span>
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-6">
                  <p className="eyebrow text-muted">{r.series}</p>
                  <h3 className="font-display mt-2 text-3xl leading-tight">
                    {href ? (
                      <Link href={href} className="hover:text-brand-deep">
                        {r.name}
                      </Link>
                    ) : (
                      r.name
                    )}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-brand-deep">
                    {r.colour} · Grip {r.grip}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-body">{r.summary}</p>
                  <dl className="mt-5 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-line pt-5 text-xs">
                    {r.specs.map((s) => (
                      <div key={s.label}>
                        <dt className="text-muted">{s.label}</dt>
                        <dd className="mt-0.5 font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {buy && p && (
                    <div className="mt-auto pt-5">
                      <p className="text-xs font-semibold text-brand-deep">This model is in stock now at {site.retailer.name}</p>
                      <Price price={p.price} compareAt={p.compareAtPrice} className="mt-1" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 border-t border-line">
                  {href ? (
                    <Link href={href} className="flex h-12 items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-ink hover:text-white">
                      View details
                    </Link>
                  ) : (
                    <span />
                  )}
                  {buy ? (
                    <a
                      href={buy}
                      target="_blank"
                      rel="noopener"
                      className="flex h-12 items-center justify-center gap-1.5 bg-brand-deep text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-ink"
                    >
                      Buy now <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">on {site.retailer.name} (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="flex h-12 items-center justify-center gap-1.5 bg-ink text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-brand-deep"
                    >
                      Ask the store
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </Stagger>
        <p className="mt-6 text-xs text-muted">Photos and specifications from Diadem. {site.retailer.name} will confirm prices for the new rackets when they arrive.</p>
      </div>
    </section>
  );
}

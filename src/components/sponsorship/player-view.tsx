import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SplitReveal, Stagger } from "@/animations/motion";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/json-ld";
import { ButtonLink, Eyebrow, SampleBadge, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import type { Academy, Product, SponsoredPlayer } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Sponsored junior page. Shows sporting information only — never date of birth,
 * school, address, phone, email or ID numbers.
 */
export function PlayerView({ player: p, academy, kit }: { player: SponsoredPlayer; academy?: Academy; kit: (Product | null)[] }) {
  const firstName = p.name.split(" ")[0];
  const kitProducts = kit.filter((k): k is Product => Boolean(k));
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <span
          aria-hidden
          className="font-display hollow pointer-events-none absolute -top-[4vw] left-[34%] select-none text-[clamp(16rem,46vw,40rem)] leading-none text-brand-bright/30"
        >
          {p.ranking.value}
        </span>
        <div className="container-x relative grid gap-10 py-14 lg:grid-cols-12 lg:items-end lg:py-20">
          <div className="lg:col-span-7">
            <Breadcrumbs
              tone="light"
              items={[
                { label: "Sponsorship", href: "/sponsorship" },
                { label: p.name, href: `/sponsorship/${p.slug}` },
              ]}
            />
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="eyebrow bg-brand-bright px-2.5 py-1 font-bold text-ink">Sponsored junior</span>
              {p.isSample && <SampleBadge />}
            </div>
            <SplitReveal as="h1" immediate className="font-display mt-5 text-7xl sm:text-8xl lg:text-9xl">
              {p.name}
            </SplitReveal>
            <p className="mt-6 max-w-xl text-lg text-white/75">{p.tagline}</p>
            <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-white/15">
              {[
                ["Age group", p.ageGroup],
                ["Sport", p.sport === "tennis" ? "Tennis" : "Pickleball"],
                [p.ranking.label, `#${p.ranking.value}`],
              ].map(([l, v]) => (
                <div key={l} className="py-4 pr-4">
                  <dt className="eyebrow text-white/55">{l}</dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={p.portrait.src} alt={p.portrait.alt} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <span className="absolute -left-3 bottom-6 flex items-center gap-2 bg-brand-deep px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xl">
              <span className="text-brand-bright">Sponsored by</span> {site.retailer.name}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow index={1}>The player</Eyebrow>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-body">
              {p.bio.map((b) => (
                <p key={b.slice(0, 30)}>{b}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-line border-y border-line">
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-muted">Coach</dt>
                <dd className="font-semibold">{p.coach}</dd>
              </div>
              {academy && (
                <div className="flex justify-between py-3 text-sm">
                  <dt className="text-muted">Academy</dt>
                  <dd className="font-semibold">
                    <Link href={`/sponsorship/${academy.slug}`} className="text-brand-deep underline underline-offset-4">
                      {academy.name}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      {p.milestoneQuote && (
        <section className="bg-brand-deep py-16 text-white lg:py-24">
          <figure className="container-x max-w-5xl">
            <blockquote className="font-display text-4xl leading-[1.05] sm:text-6xl">&ldquo;{p.milestoneQuote.text}&rdquo;</blockquote>
            <figcaption className="eyebrow mt-6 text-white/80">— {p.milestoneQuote.cite}</figcaption>
          </figure>
        </section>
      )}

      <section className="py-16 lg:py-24" aria-labelledby="kit-title">
        <div className="container-x">
          <SectionHeading eyebrow="The kit" index={2} title={<span id="kit-title">Head to toe in Diadem</span>} />
          <ul className="mt-8 flex flex-wrap gap-2">
            {p.kit.map((k, i) => (
              <li key={k.label} className="border border-line px-4 py-2 text-sm">
                <span className="text-muted">{k.label}:</span>{" "}
                {kit[i] ? (
                  <Link href={`/products/${kit[i]!.slug}`} className="font-semibold text-brand-deep underline underline-offset-4">
                    {kit[i]!.name.replace(/^Diadem\s+/i, "")}
                  </Link>
                ) : (
                  <span className="font-semibold">TBC</span>
                )}
              </li>
            ))}
          </ul>
          <Stagger className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
            {kitProducts.map((k) => (
              <div key={k.id} data-stagger>
                <ProductCard product={k} />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-24" aria-labelledby="results-title">
        <div className="container-x">
          <SectionHeading eyebrow="Results" index={3} title={<span id="results-title">Results timeline</span>} />
          <ol className="mt-12 space-y-10 border-l-2 border-brand-deep pl-8">
            {p.results.map((r, i) => (
              <li key={`${r.year}-${i}`} className="relative">
                <span aria-hidden className="absolute -left-[2.6rem] top-2 size-4 rotate-45 bg-brand-deep" />
                <p className="font-display text-4xl">{r.year}</p>
                <ul className="mt-3 space-y-2">
                  {r.items.map((it) => (
                    <li key={it.title} className={cn("text-body", it.isTitle && "font-semibold text-ink")}>
                      {it.isTitle && <span className="eyebrow mr-2 bg-accent px-1.5 py-0.5 font-bold text-ink">Title</span>}
                      {it.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {academy && (
        <section className="py-16 lg:py-24">
          <Link href={`/sponsorship/${academy.slug}`} className="container-x group grid items-center gap-8 md:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden bg-ink">
              <Image src={academy.hero.src} alt={academy.hero.alt} fill sizes="50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div>
              <Eyebrow index={4}>Home court</Eyebrow>
              <h2 className="font-display mt-4 text-5xl">{academy.name}</h2>
              <p className="mt-4 text-body">{academy.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand-deep">
                Visit the academy <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="bg-ink py-16 text-white lg:py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display text-5xl sm:text-6xl">Gear up like {firstName}</h2>
          <ButtonLink href="/category/tennis-rackets" variant="light">
            Shop the kit <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

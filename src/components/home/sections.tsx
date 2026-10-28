import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { ImageReveal, Reveal, SplitReveal, Stagger } from "@/animations/motion";
import { ArticleCard, AthleteCard } from "@/components/ui/cards";
import { ButtonLink, Eyebrow, OutlineWord, SampleBadge, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import type { Academy, Article, Athlete, ImageRef, SponsoredPlayer, Technology } from "@/lib/types";
import { retailerHome } from "@/lib/utils";

export function LatestStories({ stories }: { stories: { article: Article; cover: ImageRef; minutes: number }[] }) {
  const [lead, ...rest] = stories;
  if (!lead) return null;
  return (
    <section className="py-20 lg:py-28" aria-labelledby="stories-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Stories" index={5} title={<span id="stories-title">Latest from the court</span>} />
          <ButtonLink href="/news" variant="outline">
            All stories <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
        <Stagger className="mt-12 grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <div data-stagger className="lg:col-span-7">
            <ArticleCard {...lead} large />
          </div>
          <div className="grid gap-y-14 lg:col-span-5">
            {rest.slice(0, 2).map((s) => (
              <div key={s.article.slug} data-stagger>
                <ArticleCard {...s} />
              </div>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}

export function TechShowcase({ technologies }: { technologies: Technology[] }) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="tech-title">
      <OutlineWord className="-left-4 top-6 text-white">Engineered</OutlineWord>
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Technology"
            index={6}
            tone="light"
            title={<span id="tech-title">Built for a reason</span>}
            intro="Every weight, material and construction method is chosen with intent. Here's what's inside the gear."
          />
          <ButtonLink href="/technologies" variant="outline-light">
            All technologies <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
        <Stagger className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((t, i) => (
            <Link
              key={t.slug}
              href={`/technologies#${t.slug}`}
              data-stagger
              className="group relative flex min-h-64 flex-col justify-between overflow-hidden bg-ink p-7 transition-colors hover:bg-ink-2"
            >
              <Image
                src={t.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-45 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-60"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
              <span className="relative font-mono text-xs text-brand-bright">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative">
                <span className="font-display block text-3xl">{t.name}</span>
                <span className="mt-2 block text-sm text-white/65">{t.short}</span>
                <span className="eyebrow mt-4 block text-white/45">{t.appliesTo}</span>
              </span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32" aria-labelledby="brand-title">
      <OutlineWord className="-right-10 bottom-0 text-ink">Since 2015</OutlineWord>
      <div className="container-x relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow index={7}>The Diadem story</Eyebrow>
          <SplitReveal className="font-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
            <span id="brand-title">It started with one string.</span>
          </SplitReveal>
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="text-xl leading-relaxed text-ink">
            Diadem Sports was founded in 2015 in South Florida, in a garage, with a single tennis string — and years spent getting
            it right.
          </p>
          <p className="mt-5 leading-relaxed text-body">
            That approach now runs through Diadem&apos;s tennis rackets, pickleball paddles, strings and shoes, all designed in-house
            by a team with more than a century of combined experience as collegiate and professional players and coaches.
          </p>
          <dl className="mt-10 grid grid-cols-3 border-t border-line">
            {[
              ["2015", "Founded in South Florida"],
              ["100+", "Years of combined playing & coaching experience"],
              ["3", "Pro tours: ATP, WTA & pickleball"],
            ].map(([v, l]) => (
              <div key={l} className="border-r border-line py-5 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-5xl text-brand-deep">{v}</dd>
                <dd className="mt-2 text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/diadem" variant="dark" className="mt-10">
            Read the story <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function SponsorshipSection({
  academy,
  player,
  playerPortrait,
}: {
  academy: Academy;
  player: SponsoredPlayer;
  playerPortrait: ImageRef;
}) {
  return (
    <section className="bg-mist py-20 lg:py-28" aria-labelledby="sponsor-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Sponsorship"
            index={8}
            title={<span id="sponsor-title">Backing Sri Lankan sport</span>}
            intro={`${site.retailer.name} supports academies and junior players with Diadem equipment, stringing and on-court investment.`}
          />
          <ButtonLink href="/sponsorship" variant="outline">
            Our programme <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
        <Stagger className="mt-12 grid gap-4 lg:grid-cols-2">
          <Link
            href={`/sponsorship/${academy.slug}`}
            data-stagger
            className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden bg-ink p-8 text-white"
          >
            <Image src={academy.hero.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-20 object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105" />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
            {academy.isSample && <SampleBadge className="absolute left-6 top-6" />}
            <span className="eyebrow text-brand-bright">Partner academy</span>
            <span className="font-display mt-2 text-5xl">{academy.name}</span>
            <span className="mt-3 max-w-md text-white/75">{academy.tagline}</span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
              Visit the academy <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href={`/sponsorship/${player.slug}`}
            data-stagger
            className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden bg-brand-deep p-8 text-white"
          >
            <Image src={playerPortrait.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-20 object-cover object-top opacity-70 transition-transform duration-1000 group-hover:scale-105" />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-deep via-brand-deep/40 to-transparent" />
            {player.isSample && <SampleBadge className="absolute left-6 top-6" />}
            <span className="eyebrow text-white">Sponsored junior · {player.ageGroup}</span>
            <span className="font-display mt-2 text-5xl">{player.name}</span>
            <span className="mt-3 max-w-md text-white/80">{player.tagline}</span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
              Meet the player <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Stagger>
      </div>
    </section>
  );
}

export function AthletesStrip({ athletes }: { athletes: { athlete: Athlete; portrait: ImageRef }[] }) {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="athletes-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Team Diadem"
            index={9}
            title={<span id="athletes-title">Proven on tour</span>}
            intro="The pros who compete with Diadem on the ATP, WTA and pro pickleball tours."
          />
          <ButtonLink href="/athletes" variant="outline">
            All athletes <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>
      <Stagger className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 lg:px-10">
        {athletes.map(({ athlete, portrait }) => (
          <div key={athlete.slug} data-stagger className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
            <AthleteCard athlete={athlete} portrait={portrait} />
          </div>
        ))}
      </Stagger>
    </section>
  );
}

export function RetailerBanner({ logo }: { logo: ImageRef | null }) {
  const r = site.retailer;
  return (
    <section className="bg-brand-deep text-white" aria-labelledby="retailer-title">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
        <ImageReveal className="relative hidden aspect-square bg-ink lg:col-span-3 lg:block">
          {logo ? (
            <Image src={logo.src} alt={logo.alt || r.name} fill sizes="(min-width: 1024px) 20vw, 1px" className="object-contain p-8" />
          ) : (
            <span className="font-display absolute inset-0 grid place-items-center p-6 text-center text-4xl leading-[0.9] text-white">{r.name}</span>
          )}
        </ImageReveal>
        <div className="lg:col-span-6">
          <p className="eyebrow text-white/80">Where to buy</p>
          <h2 id="retailer-title" className="font-display mt-3 text-5xl sm:text-6xl">
            Buy from {r.name}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/85">{r.about}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {r.stores.map((s) => (
              <li key={s.name} className="flex gap-2 text-sm text-white/85">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                {s.address}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-3">
          <a
            href={retailerHome("retailer-banner")}
            target="_blank"
            rel="noopener"
            className="inline-flex h-14 items-center justify-center gap-2 bg-white px-6 text-sm font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Shop {r.host} <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link
            href="/contact"
            className="inline-flex h-14 items-center justify-center gap-2 border border-white/60 px-6 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-ink"
          >
            Contact the store
          </Link>
        </div>
      </div>
    </section>
  );
}

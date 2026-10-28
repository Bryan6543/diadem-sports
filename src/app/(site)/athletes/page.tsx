import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stagger } from "@/animations/motion";
import { CollectionHero } from "@/components/product/collection-hero";
import { AthleteCard } from "@/components/ui/cards";
import { SampleBadge } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getAthletes, getSponsoredPlayers } from "@/lib/catalog";
import { getSiteImage } from "@/lib/site-images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Team Diadem athletes",
  description: "Meet Team Diadem — Alexander Bublik, Elina Svitolina, Yuta Funemizu and the pros who compete with Diadem on the ATP, WTA and pickleball tours.",
  alternates: { canonical: "/athletes" },
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "tennis", label: "Tennis" },
  { value: "pickleball", label: "Pickleball" },
];

export default async function AthletesPage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport = "" } = await searchParams;
  const all = getAthletes();
  const list = sport ? all.filter((a) => a.sport === sport) : all;
  const cards = await Promise.all(
    list.map(async (a) => ({ athlete: a, portrait: (await getSiteImage(`athlete.${a.slug}`)) ?? a.photo })),
  );
  const juniors = getSponsoredPlayers().filter((p) => !sport || p.sport === sport);

  return (
    <>
      <CollectionHero
        eyebrow="Team Diadem"
        title="Proven on tour"
        intro="The pro roster that competes with Diadem across the ATP, WTA and pro pickleball tours — every one of them with gear you can buy."
        outline="Athletes"
        image={{ src: "/images/brand/athlete-elina-svitolina.jpg", alt: "Elina Svitolina striking a forehand on clay" }}
        position="30% 30%"
        crumbs={[{ label: "Athletes", href: "/athletes" }]}
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Filter by sport">
          {FILTERS.map((f) => (
            <li key={f.value}>
              <Link
                href={f.value ? `/athletes?sport=${f.value}` : "/athletes"}
                aria-current={sport === f.value ? "page" : undefined}
                className={cn(
                  "inline-block border px-4 py-2 text-sm font-semibold",
                  sport === f.value ? "border-white bg-white text-ink" : "border-white/30 hover:border-white",
                )}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </CollectionHero>

      <div className="container-x py-14 lg:py-20">
        {juniors.map((p) => (
          <Link
            key={p.slug}
            href={`/sponsorship/${p.slug}`}
            className="group relative mb-12 grid overflow-hidden bg-brand-deep text-white md:grid-cols-[18rem_1fr]"
          >
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image src={p.portrait.src} alt={p.portrait.alt} fill sizes="18rem" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-3 p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow bg-ink px-2.5 py-1 text-brand-bright">Sponsored by {site.retailer.name}</span>
                {p.isSample && <SampleBadge />}
              </div>
              <h2 className="font-display text-5xl sm:text-6xl">{p.name}</h2>
              <p className="text-white/80">
                {p.ageGroup} · {p.sport === "tennis" ? "Tennis" : "Pickleball"} · Coach: {p.coach}
              </p>
              <p className="max-w-xl text-white/75">{p.tagline}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
                Meet the player <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map(({ athlete, portrait }) => (
            <div key={athlete.slug} data-stagger>
              <AthleteCard athlete={athlete} portrait={portrait} />
            </div>
          ))}
        </Stagger>
        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">
          Roster, rankings and equipment as published by Diadem at diademsports.com/pages/team-diadem. Photos: Diadem Sports. Team Diadem athletes are sponsored by Diadem Sports, not by {site.retailer.name}.
        </p>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Reveal, SplitReveal, Stagger } from "@/animations/motion";
import { CategoryBento } from "@/components/home/category-bento";
import { CollectionHero } from "@/components/product/collection-hero";
import { Eyebrow, OutlineWord, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { availableInCategory, categoryTilePhoto, getCategories } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { getSiteImageOverride } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "The Diadem story",
  description: "Founded in 2015 in South Florida with a single tennis string, Diadem now designs rackets, paddles, strings and shoes used on the pro tour.",
  alternates: { canonical: "/diadem" },
};

export const revalidate = 3600;

/** Sourced from diademsports.com/pages/about-us and /pages/team-diadem (checked 13 Oct 2026). */
const timeline = [
  {
    label: "2015",
    title: "One string, in a garage",
    text: "Diadem Sports is founded in South Florida with a single focus: set the standard for performance equipment in racket sports. It starts with one tennis string, and years spent getting it right.",
  },
  {
    label: "Then",
    title: "From strings to the full game",
    text: "The same deliberate approach is applied to tennis rackets, pickleball paddles, strings and shoes — all designed in-house by former collegiate and professional players and coaches.",
  },
  {
    label: "Tour",
    title: "Proven by the players",
    text: "Diadem is trusted at the highest levels, including Elina Svitolina (career-high WTA No. 3) and Yuta Funemizu, Japan's No. 1 pro pickleball player.",
  },
  {
    label: "2026",
    title: "Project Bublik",
    text: "Alexander Bublik (career-high ATP No. 10) joins Team Diadem in April 2026 — not to endorse a finished racket, but to build one with Diadem's engineers.",
  },
  {
    label: "Today",
    title: "Diadem in Sri Lanka",
    text: `Diadem tennis and pickleball equipment is available in Sri Lanka from ${site.retailer.name}, which has served the country's racquet sports for over 35 years.`,
  },
];

const values = [
  { title: "Crafted with intent", text: "Every weight, material and construction method is chosen for a reason, and built to perform match after match, season after season." },
  { title: "Designed by players", text: "The team has lived the game as players and coaches, and builds what they'd want in their own hands." },
  { title: "Proven under pressure", text: "Equipment is tested in the lab and on court, from club players to the pro tour, before it carries the Diadem name." },
  { title: "In your corner", text: "From juniors and teaching pros to the world's best, Diadem stands behind the players who carry its name." },
];

export default async function DiademPage() {
  const products = await getProducts();
  const tiles = await Promise.all(
    getCategories().map(async (c) => ({
      category: c,
      count: availableInCategory(c.slug, products).length,
      photo: await getSiteImageOverride(`category.${c.slug}`),
      product: categoryTilePhoto(c, products),
    })),
  );

  return (
    <>
      <CollectionHero
        eyebrow="The Diadem story"
        title="Diadem means crown"
        intro="And every crown is earned. Diadem's mark is three diamonds — formed under pressure and built to last. Great players earn their place the same way."
        outline="Since 2015"
        image={{ src: "/images/brand/bublik-bench.jpg", alt: "Alexander Bublik sitting courtside with a Diadem bag and racket" }}
        position="60% 40%"
        crumbs={[{ label: "The Diadem story", href: "/diadem" }]}
      />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index={1}>Mission</Eyebrow>
            <SplitReveal className="font-display mt-4 text-5xl sm:text-6xl">
              For players driven to reach the top of their game.
            </SplitReveal>
          </div>
          <Reveal className="space-y-5 text-lg leading-relaxed text-body lg:col-span-6 lg:col-start-7">
            <p>
              Diadem crafts racket sports equipment for players driven to reach the top of their game. It designs for feel, performance
              and longevity — and proves it on court.
            </p>
            <p>
              From breakthroughs like its patented StarCore construction to every grip, weight and string, each decision has a purpose.
              In Diadem&apos;s words: innovation is not a feature, it is a responsibility.
            </p>
            <p className="text-sm text-muted">Source: diademsports.com — About us.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-white lg:py-28" aria-labelledby="timeline-title">
        <div className="container-x">
          <SectionHeading eyebrow="Timeline" index={2} tone="light" title={<span id="timeline-title">From a garage to the tour</span>} />
          <Stagger as="ol" className="mt-14 grid gap-px bg-white/10 md:grid-cols-5">
            {timeline.map((t) => (
              <li key={t.title} data-stagger className="bg-ink p-6 lg:p-8">
                <p className="font-display text-5xl text-brand-bright">{t.label}</p>
                <h3 className="mt-6 text-lg font-semibold">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{t.text}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="values-title">
        <OutlineWord className="-right-6 top-10 text-ink">Pressure</OutlineWord>
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Principles"
            index={3}
            title={<span id="values-title">Pressure makes diamonds</span>}
            intro="It's the mindset behind everything Diadem does — a reminder that picking up a racket or paddle is about staying active, feeling your best and connecting with the people on court with you."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} data-stagger className="border-t-2 border-brand-deep pt-6">
                <p className="font-mono text-xs text-brand-deep">0{i + 1}</p>
                <h3 className="font-display mt-3 text-3xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">{v.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-line py-20 lg:py-28" aria-labelledby="explore-title">
        <div className="container-x">
          <SectionHeading eyebrow="Explore" index={4} title={<span id="explore-title">Explore by category</span>} />
          <div className="mt-12">
            <CategoryBento tiles={tiles} />
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger } from "@/animations/motion";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { CollectionHero } from "@/components/product/collection-hero";
import { ButtonLink, SampleBadge, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { sponsorshipProgramme } from "@/data/sponsorships";
import { getSponsorships } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sponsorship",
  description: `How ${site.retailer.name} and Diadem support Sri Lankan academies and junior players.`,
  alternates: { canonical: "/sponsorship" },
};

export default function SponsorshipPage() {
  const partners = getSponsorships();
  return (
    <>
      <CollectionHero
        eyebrow={`${site.retailer.name} × Diadem`}
        title="Backing Sri Lankan sport"
        intro={sponsorshipProgramme.intro}
        outline="Together"
        image={{ src: "/images/brand/players-on-court.jpg", alt: "Players on a tennis court" }}
        crumbs={[{ label: "Sponsorship", href: "/sponsorship" }]}
      />

      <section className="border-b border-line">
        <Stagger className="container-x grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {sponsorshipProgramme.stats.map((s) => (
            <div key={s.label} data-stagger className="py-10 sm:px-8 sm:first:pl-0">
              <p className="font-display text-6xl text-brand-deep">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Stagger>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="partners-title">
        <div className="container-x">
          <SectionHeading eyebrow="Partners" index={1} title={<span id="partners-title">Featured partners</span>} />
          <div className="mt-12 space-y-4">
            {partners.map((p) => {
              const img = p.kind === "academy" ? p.hero : p.portrait;
              return (
                <Reveal key={p.slug}>
                  <Link href={`/sponsorship/${p.slug}`} className="group relative isolate grid min-h-[22rem] overflow-hidden bg-ink text-white md:grid-cols-2">
                    <div className="relative min-h-60">
                      <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center gap-3 p-8 lg:p-12">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow text-brand-bright">{p.kind === "academy" ? "Partner academy" : `Sponsored junior · ${p.ageGroup}`}</span>
                        {p.isSample && <SampleBadge />}
                      </div>
                      <h3 className="font-display text-5xl">{p.name}</h3>
                      <p className="max-w-md text-white/75">{p.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
                        {p.kind === "academy" ? "Visit the academy" : "Meet the player"}
                        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-24" aria-labelledby="areas-title">
        <div className="container-x">
          <SectionHeading eyebrow="Programme" index={2} title={<span id="areas-title">Where we invest</span>} />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {sponsorshipProgramme.areas.map((a, i) => (
              <div key={a.title} data-stagger className="bg-white p-8">
                <p className="font-mono text-xs text-brand-deep">0{i + 1}</p>
                <h3 className="font-display mt-3 text-3xl">{a.title}</h3>
                <p className="mt-3 text-body">{a.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-5xl">Run an academy or club?</h2>
            <p className="mt-4 max-w-lg text-body">
              Tell us about your programme. {site.retailer.name} reviews partnership requests for equipment, stringing and on-court support.
            </p>
            <ButtonLink href="/contact?topic=sponsorship" variant="dark" className="mt-6">
              Get in touch <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
          <div className="border border-line p-8">
            <p className="eyebrow text-brand-deep">Follow the programme</p>
            <p className="mt-3 text-body">Get partner stories and junior results by email.</p>
            <NewsletterForm source="sponsorship" className="mt-5" />
          </div>
        </div>
      </section>
    </>
  );
}

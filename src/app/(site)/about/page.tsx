import type { Metadata } from "next";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Reveal, Stagger } from "@/animations/motion";
import { CollectionHero } from "@/components/product/collection-hero";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getSiteImageOverride } from "@/lib/site-images";
import { retailerHome, telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About us",
  description: `diademsports.lk is run by ${site.retailer.legalName}, Sri Lanka's long-serving racquet sports specialist.`,
  alternates: { canonical: "/about" },
};

export const revalidate = 3600;

/** Retailer facts from unitedsports.lk/pages/united-sports and /pages/founder (checked 13 Oct 2026). */
const values = [
  { title: "Integrity", text: "Honesty, transparency and fairness in every customer interaction and business decision." },
  { title: "Customer commitment", text: "Trusted advice, reliable service and a better experience for every customer." },
  { title: "Excellence", text: "High standards across products, services, expertise and customer care." },
  { title: "Community impact", text: "Building stronger communities through sport by nurturing talent and supporting local clubs." },
];

export default async function AboutPage() {
  const hero = await getSiteImageOverride("about.hero");
  const r = site.retailer;
  return (
    <>
      <CollectionHero
        eyebrow={`About ${r.name}`}
        title="Diadem, in Sri Lanka"
        intro={`This site is run by ${r.legalName} so Sri Lankan players can explore the Diadem range in depth — then buy it, with local service, from ${r.host}.`}
        outline="35+ years"
        background={hero}
        image={{ src: "/images/brand/rackets-fence.jpg", alt: "A line-up of Diadem tennis rackets against a court fence" }}
        position="50% 30%"
        crumbs={[{ label: "About", href: "/about" }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index={1}>Who we are</Eyebrow>
            <h2 className="font-display mt-4 text-5xl sm:text-6xl">Over 35 years in racquet sports</h2>
          </div>
          <Reveal className="space-y-5 text-lg leading-relaxed text-body lg:col-span-6 lg:col-start-7">
            <p>
              For more than three decades, {r.legalName} has served racquet sports in Sri Lanka — national athletes, school teams and
              first-time players alike — with product knowledge, service and a genuine passion for sport.
            </p>
            <p>
              Founder and Managing Director Mr. Thilak Meddegoda is a U.S.R.S.A.-certified stringer and racquet technician, and the company
              is known for professional stringing, equipment consultation and racquet maintenance.
            </p>
            <blockquote className="border-l-4 border-brand-deep pl-5 text-ink">
              &ldquo;We&apos;re not just selling products — we&apos;re building a legacy, one racquet at a time.&rdquo;
              <footer className="eyebrow mt-3 text-muted">— Mr. Thilak Meddegoda, Founder &amp; Managing Director</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What we stand for" index={2} title="Our values" />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} data-stagger className="bg-white p-7">
                <h3 className="font-display text-3xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">{v.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How this site works" index={3} title="Explore here. Buy there." />
            <ol className="mt-8 space-y-4">
              {[
                "Browse products, technology and stories on diademsports.lk.",
                `Press Buy now to open the exact product on ${r.host}.`,
                `Choose your option and check out with ${r.name}, who handles payment, delivery and after-sales care.`,
              ].map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display text-3xl text-brand-deep">0{i + 1}</span>
                  <span className="pt-1 text-body">{t}</span>
                </li>
              ))}
            </ol>
            <ButtonLink href={retailerHome("about")} external variant="dark" className="mt-8">
              Shop {r.host}
            </ButtonLink>
          </div>
          <div className="bg-ink p-8 text-white lg:p-10">
            <p className="eyebrow text-brand-bright">Visit us</p>
            <ul className="mt-6 space-y-8">
              {r.stores.map((s) => (
                <li key={s.name}>
                  <p className="font-display text-2xl">{s.name}</p>
                  <a href={s.mapsUrl} target="_blank" rel="noopener" className="mt-3 flex gap-2 text-sm text-white/75 hover:text-white">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                    {s.address}
                  </a>
                  <p className="mt-2 flex flex-wrap gap-3 text-sm">
                    <Phone aria-hidden className="mt-0.5 size-4 text-brand-bright" />
                    {s.phones.map((p) => (
                      <a key={p} href={telHref(p)} className="text-white/75 hover:text-white">
                        {p}
                      </a>
                    ))}
                  </p>
                  <p className="mt-2 pl-6 text-xs text-white/50">{s.hours}</p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" variant="outline-light" className="mt-8">
              Contact us <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-10">
        <p className="container-x max-w-4xl text-sm leading-relaxed text-muted">{site.disclaimer}</p>
      </section>
    </>
  );
}

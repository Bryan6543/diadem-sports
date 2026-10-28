import Image from "next/image";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { ImageReveal, Reveal, SplitReveal, Stagger } from "@/animations/motion";
import { Breadcrumbs } from "@/components/ui/json-ld";
import { Eyebrow, SampleBadge, SectionHeading } from "@/components/ui/primitives";
import { SocialIcon } from "@/components/ui/social-icons";
import { site } from "@/data/site";
import type { Academy } from "@/lib/types";
import { telHref } from "@/lib/utils";
import { BeforeAfter } from "./before-after";

export function AcademyView({ academy: a }: { academy: Academy }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={a.hero.src} alt={a.hero.alt} fill preload sizes="100vw" className="-z-20 object-cover opacity-70" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="container-x py-14 lg:py-24">
          <Breadcrumbs
            tone="light"
            items={[
              { label: "Sponsorship", href: "/sponsorship" },
              { label: a.name, href: `/sponsorship/${a.slug}` },
            ]}
          />
          {/* Co-branded lockup: Diadem × Retailer × Partner */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-[0.2em]">
            <span className="font-display text-2xl tracking-[0.08em]">Diadem</span>
            <span aria-hidden className="text-brand-bright">×</span>
            <span>{site.retailer.name}</span>
            <span aria-hidden className="text-brand-bright">×</span>
            {a.logo ? (
              <Image src={a.logo.src} alt={a.logo.alt} width={120} height={40} className="h-8 w-auto" />
            ) : (
              <span>{a.shortName}</span>
            )}
            {a.isSample && <SampleBadge />}
          </div>
          <SplitReveal as="h1" immediate className="font-display mt-6 max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
            {a.name}
          </SplitReveal>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{a.tagline}</p>
        </div>
        <dl className="border-t border-white/10 bg-ink/60 backdrop-blur">
          <div className="container-x grid grid-cols-2 md:grid-cols-4">
            {a.facts.map((f, i) => (
              <div key={f.label} className={`py-6 ${i % 2 ? "pl-6" : ""} md:pl-6 md:first:pl-0 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}>
                <dt className="eyebrow text-white/55">{f.label}</dt>
                <dd className="font-display mt-2 text-3xl text-brand-bright">{f.value}</dd>
              </div>
            ))}
          </div>
        </dl>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow index={1}>The academy</Eyebrow>
            <h2 className="font-display mt-4 text-5xl">Our story</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-body">
              {a.story.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <div className="bg-mist p-8">
              <p className="eyebrow text-brand-deep">Founder</p>
              <p className="font-display mt-3 text-3xl">{a.founder.name}</p>
              <p className="mt-1 text-sm text-muted">{a.founder.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-body">{a.founder.bio}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Mission" index={2} tone="light" title={a.mission} className="max-w-4xl" />
          <Stagger className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {a.pillars.map((p, i) => (
              <div key={p.title} data-stagger className="bg-ink p-8">
                <p className="font-mono text-xs text-brand-bright">0{i + 1}</p>
                <h3 className="font-display mt-3 text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm text-white/70">{p.text}</p>
              </div>
            ))}
          </Stagger>
          <h3 className="eyebrow mt-14 text-brand-bright">Facilities</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {a.facilities.map((f) => (
              <li key={f} className="border border-white/20 px-4 py-2 text-sm">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {a.before[0] && a.after[0] && (
        <section className="py-16 lg:py-24" aria-labelledby="transform-title">
          <div className="container-x">
            <SectionHeading eyebrow="Transformation" index={3} title={<span id="transform-title">Before & after</span>} />
            <div className="mt-10">
              <BeforeAfter before={a.before[0]} after={a.after[0]} label={`${a.name} before and after`} />
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {[
                { title: "Before", list: a.before },
                { title: "After", list: a.after },
              ].map((g) => (
                <div key={g.title}>
                  <h3 className="eyebrow text-muted">{g.title}</h3>
                  <ul className="mt-4 grid grid-cols-2 gap-3">
                    {g.list.map((img) => (
                      <li key={img.src}>
                        <ImageReveal className="relative aspect-[4/3] bg-mist">
                          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                        </ImageReveal>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-mist py-16 lg:py-24" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeading eyebrow="Partnership" index={4} title={<span id="how-title">How it came together</span>} />
          <Stagger as="ol" className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {a.timeline.map((t) => (
              <li key={t.label} data-stagger className="relative bg-white p-8">
                <span className="font-display text-6xl text-brand-deep/25">{t.label}</span>
                <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-body">{t.text}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="visit-title">
        <div className="container-x">
        <div className="grid gap-10 bg-brand-deep p-8 text-white md:grid-cols-2 lg:p-14">
          <div>
            <p className="eyebrow text-white/80">Visit</p>
            <h2 id="visit-title" className="font-display mt-3 text-5xl">
              Come and play
            </h2>
            <p className="mt-4 text-white/80">{a.location}</p>
          </div>
          <ul className="space-y-4 text-sm">
            <li>
              <a href={a.mapsUrl} target="_blank" rel="noopener" className="flex gap-3 hover:underline">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0" />
                <span>
                  {a.address}
                  <span className="sr-only"> (opens Google Maps)</span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              </a>
            </li>
            {a.phones.map((p) => (
              <li key={p}>
                <a href={telHref(p)} className="flex gap-3 hover:underline">
                  <Phone aria-hidden className="mt-0.5 size-5 shrink-0" />
                  {p}
                </a>
              </li>
            ))}
            {a.phones.length === 0 && <li className="text-white/70">Phone number to be confirmed.</li>}
            {a.socials.length > 0 && (
              <li className="flex gap-2 pt-2">
                {a.socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="grid size-11 place-items-center border border-white/40 hover:bg-white hover:text-ink"
                    aria-label={`${a.name} on ${s.label} (opens in a new tab)`}
                  >
                    <SocialIcon name={s.label.toLowerCase()} />
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>
        </div>
      </section>
    </>
  );
}

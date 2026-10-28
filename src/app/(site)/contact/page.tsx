import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { CollectionHero } from "@/components/product/collection-hero";
import { SocialIcon } from "@/components/ui/social-icons";
import { site } from "@/data/site";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.retailer.name} about Diadem products, stringing or sponsorship.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const r = site.retailer;
  return (
    <>
      <CollectionHero
        eyebrow="Contact"
        title="Talk to the team"
        intro={`Questions about a racket, a string set-up or a sponsorship? ${r.name} will help.`}
        outline="Contact"
        image={{ src: "/images/brand/coach-lesson.jpg", alt: "A coach feeding balls during a lesson" }}
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <div className="container-x grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <h2 className="font-display text-4xl">Send a message</h2>
          <p className="mt-2 text-body">For orders already placed, please contact {r.host} directly.</p>
          <div className="mt-8">
            <ContactForm defaultTopic={topic} />
          </div>
        </div>
        <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="eyebrow text-brand-deep">Email</p>
            <a href={`mailto:${site.contactEmail}`} className="mt-2 flex items-center gap-2 font-semibold hover:text-brand-deep">
              <Mail aria-hidden className="size-4" /> {site.contactEmail}
            </a>
          </div>
          {r.stores.map((s) => (
            <div key={s.name}>
              <p className="eyebrow text-brand-deep">{s.name}</p>
              <a href={s.mapsUrl} target="_blank" rel="noopener" className="mt-2 flex gap-2 text-sm hover:text-brand-deep">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" /> {s.address}
              </a>
              <p className="mt-2 flex flex-wrap gap-3 text-sm">
                <Phone aria-hidden className="mt-0.5 size-4" />
                {s.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="font-semibold hover:text-brand-deep">
                    {p}
                  </a>
                ))}
              </p>
              <p className="mt-1 pl-6 text-xs text-muted">{s.hours}</p>
            </div>
          ))}
          <div>
            <p className="eyebrow text-brand-deep">Follow</p>
            <ul className="mt-3 flex gap-2">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="grid size-11 place-items-center border border-line hover:border-ink hover:bg-ink hover:text-white"
                    aria-label={`${r.name} on ${s.label} (opens in a new tab)`}
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Logo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/social-icons";
import { site } from "@/data/site";
import { getStockedCategories } from "@/lib/catalog";
import { retailerHome, telHref } from "@/lib/utils";

export function Footer() {
  const categories = getStockedCategories();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo className="h-14 sm:h-16" />
          <p className="font-display mt-6 text-4xl text-white sm:text-5xl">{site.tagline}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Get new arrivals, restocks and stories from Sri Lanka&apos;s courts.
          </p>
          <NewsletterForm source="footer" tone="light" className="mt-4 max-w-sm" />
          <ul className="mt-8 flex gap-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="grid size-11 place-items-center border border-white/20 transition-colors hover:border-brand-bright hover:text-brand-bright"
                  aria-label={`${site.retailer.name} on ${s.label} (opens in a new tab)`}
                >
                  <SocialIcon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Shop" className="lg:col-span-2">
          <p className="eyebrow text-brand-bright">Shop</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/products" className="text-white/75 hover:text-white">
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="text-white/75 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" className="text-white/75 hover:text-white">
                Wishlist
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Discover" className="lg:col-span-2">
          <p className="eyebrow text-brand-bright">Discover</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ["About Us", "/about"],
              ["The Diadem Story", "/diadem"],
              ["Technologies", "/technologies"],
              ["Athletes", "/athletes"],
              ["Sponsorship", "/sponsorship"],
              ["Stories", "/news"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/75 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="eyebrow text-brand-bright">Visit {site.retailer.name}</p>
          <ul className="mt-5 space-y-6">
            {site.retailer.stores.map((s) => (
              <li key={s.name} className="text-sm">
                <p className="font-semibold">{s.name}</p>
                <a href={s.mapsUrl} target="_blank" rel="noopener" className="mt-2 flex gap-2 text-white/70 hover:text-white">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                  <span>
                    {s.address}
                    <span className="sr-only"> (opens Google Maps)</span>
                  </span>
                </a>
                <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                  {s.phones.map((p) => (
                    <a key={p} href={telHref(p)} className="text-white/70 hover:text-white">
                      {p}
                    </a>
                  ))}
                </p>
                <p className="mt-1.5 pl-6 text-xs text-white/50">{s.hours}</p>
              </li>
            ))}
          </ul>
          <a
            href={retailerHome("footer")}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-block text-sm font-semibold text-brand-bright underline-offset-4 hover:underline"
          >
            Shop online at {site.retailer.host}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-8 text-xs text-white/55 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-3xl leading-relaxed">{site.disclaimer}</p>
          <div className="flex shrink-0 flex-wrap gap-x-5 gap-y-2">
            <span>
              © {year} {site.retailer.legalName}
            </span>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ImageReveal, Reveal } from "@/animations/motion";
import { CollectionHero } from "@/components/product/collection-hero";
import { ProductCard } from "@/components/product/product-card";
import { getTechnologies } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { cn, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Diadem technologies",
  description: "Kraibon, the Flex Stabilization System, Air Foil frames, eTPU quiet faces and more — Diadem's technologies explained.",
  alternates: { canonical: "/technologies" },
};

export const revalidate = 3600;

export default async function TechnologiesPage() {
  const products = await getProducts();
  const techs = getTechnologies();
  return (
    <>
      <CollectionHero
        eyebrow={`${techs.length} technologies`}
        title="Built for a reason"
        intro="At Diadem, design is a decision. These are the materials and constructions inside the gear — described the way Diadem describes them."
        outline="Engineered"
        image={{ src: "/images/brand/axis-serve.jpg", alt: "A player holding a Diadem Axis racket and a ball" }}
        crumbs={[{ label: "Technologies", href: "/technologies" }]}
      />
      <nav aria-label="Technologies" className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur xl:top-[4.5rem]">
        <ul className="container-x no-scrollbar flex gap-1 overflow-x-auto py-3">
          {techs.map((t) => (
            <li key={t.slug} className="shrink-0">
              <a href={`#${t.slug}`} className="eyebrow block px-3 py-2 text-muted hover:bg-mist hover:text-ink">
                {t.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container-x divide-y divide-line">
        {techs.map((t, i) => {
          const using = products.filter((p) => p.technologies.includes(t.slug)).slice(0, 3);
          return (
            <section key={t.slug} id={t.slug} className="grid scroll-mt-40 gap-10 py-16 lg:grid-cols-12 lg:py-24" aria-labelledby={`${t.slug}-title`}>
              <ImageReveal
                className={cn(
                  "relative aspect-[4/3] lg:col-span-5",
                  t.image.src.startsWith("/") ? "bg-ink" : "bg-white ring-1 ring-line",
                  i % 2 && "lg:order-2 lg:col-start-8",
                )}
              >
                {/* Brand photos fill the frame; retailer product shots (white background) are shown whole. */}
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={t.image.src.startsWith("/") ? "object-cover" : "object-contain p-6"}
                />
              </ImageReveal>
              <Reveal className={cn("lg:col-span-6", i % 2 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7")}>
                <p className="eyebrow text-brand-deep">
                  {pad(i + 1)} — {t.appliesTo}
                </p>
                <h2 id={`${t.slug}-title`} className="font-display mt-4 text-5xl sm:text-6xl">
                  {t.name}
                </h2>
                <p className="mt-3 text-lg font-semibold text-ink">{t.short}</p>
                <p className="mt-4 leading-relaxed text-body">{t.description}</p>
                <a
                  href={t.source}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted underline underline-offset-4 hover:text-ink"
                >
                  Source: diademsports.com <ExternalLink aria-hidden className="size-3" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                {using.length > 0 && (
                  <div className="mt-8">
                    <p className="eyebrow text-muted">Find it in</p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {using.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                    <Link href={`/products?tech=${t.slug}`} className="mt-5 inline-block text-sm font-semibold text-brand-deep underline underline-offset-4">
                      All products with {t.name}
                    </Link>
                  </div>
                )}
              </Reveal>
            </section>
          );
        })}
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Parallax, Reveal, SplitReveal } from "@/animations/motion";
import { Price } from "@/components/product/price";
import { ButtonLink, Eyebrow } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getTechnologiesBySlugs } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn, withReferral } from "@/lib/utils";

/** Product spotlight on an angled stage — one clean parallelogram behind the product. */
export function Spotlight({ product, index, flip }: { product: Product; index: number; flip?: boolean }) {
  const tech = getTechnologiesBySlugs(product.technologies).slice(0, 3);
  const specs = product.specs.filter((s) => !/code/i.test(s.label)).slice(0, 5);
  const img = product.images[0];
  return (
    <section className="overflow-hidden py-20 lg:py-28" aria-labelledby={`spot-${product.slug}`}>
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={cn("relative", flip && "lg:order-2")}>
          <div aria-hidden className="clip-angle absolute inset-x-0 inset-y-[12%] bg-brand" />
          {/* Product shots have opaque white backgrounds, so they sit on their own white card above the stage. */}
          <Parallax speed={10} className="relative mx-auto aspect-[4/5] max-w-sm bg-white shadow-xl">
            {img && (
              <Image
                src={img.src}
                alt={img.alt || product.name}
                fill
                sizes="(min-width: 1024px) 34vw, 85vw"
                className="object-contain"
              />
            )}
          </Parallax>
        </div>
        <div>
          <Eyebrow index={index}>Spotlight · {product.type}</Eyebrow>
          <SplitReveal as="h2" className="font-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
            <span id={`spot-${product.slug}`}>{product.name.replace(/^Diadem\s+/i, "")}</span>
          </SplitReveal>
          <Reveal>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">{product.shortDescription}</p>
            {specs.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 border-t border-line sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="border-b border-line py-3 pr-3">
                    <dt className="eyebrow text-muted">{s.label}</dt>
                    <dd className="mt-1 text-sm font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tech.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {tech.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/technologies#${t.slug}`}
                      className="eyebrow inline-block border border-brand-deep/30 px-2.5 py-1.5 text-brand-deep hover:bg-brand-wash"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/products/${product.slug}`} variant="dark">
                View product <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href={withReferral(product.retailerUrl, `spotlight-${product.slug}`)} external variant="outline">
                Shop at {site.retailer.name}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, MapPin, X } from "lucide-react";
import { Reveal, Stagger } from "@/animations/motion";
import { BuyBar } from "@/components/product/buy-bar";
import { Price } from "@/components/product/price";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Breadcrumbs, JsonLd } from "@/components/ui/json-ld";
import { Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { arrivingSoon } from "@/data/arriving-soon";
import { getCategory, getTechnologiesBySlugs } from "@/lib/catalog";
import { getComplementaryProducts, getProduct, getProducts, getRelatedProducts } from "@/lib/products";
import { absoluteUrl, cn, isSoldLocally, withReferral } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.shortDescription.slice(0, 160),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: "website",
      title: p.name,
      description: p.shortDescription.slice(0, 160),
      url: `/products/${p.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, complementary] = await Promise.all([getRelatedProducts(product), getComplementaryProducts(product)]);
  const category = getCategory(product.category);
  const tech = getTechnologiesBySlugs(product.technologies);
  const local = isSoldLocally(product);
  const arriving = arrivingSoon.find((r) => r.productSlug === product.slug);
  const buyHref = withReferral(product.retailerUrl, product.slug);
  const specs = product.specs;

  return (
    <>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <Eyebrow>
            {category?.name} · {product.type}
          </Eyebrow>
          <h1 className="font-display mt-4 text-5xl sm:text-6xl">{product.name}</h1>
          {local ? (
            <>
              <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-6" />
              <p className={cn("mt-3 flex items-center gap-2 text-sm font-semibold", product.inStock ? "text-brand-deep" : "text-muted")}>
                {product.inStock ? <Check aria-hidden className="size-4" /> : <X aria-hidden className="size-4" />}
                {product.inStock ? `In stock at ${site.retailer.name}` : `Currently sold out at ${site.retailer.name}`}
              </p>
              {arriving && (
                <p className="mt-3 inline-block bg-brand-wash px-3 py-2 text-sm text-ink">
                  <span className="font-semibold">New stock arriving soon</span> — grip {arriving.grip}, on our latest order from Diadem.
                </p>
              )}
            </>
          ) : arriving ? (
            <>
              <p className="eyebrow mt-6 inline-block bg-brand-bright px-2.5 py-1 font-bold text-ink">Arriving soon</p>
              <p className="mt-3 text-sm font-semibold text-brand-deep">
                On its way to {site.retailer.name} · {arriving.colour} · grip {arriving.grip}
              </p>
            </>
          ) : (
            <p className="eyebrow mt-6 text-brand-deep">Diadem global range</p>
          )}
          <p className="mt-6 text-lg leading-relaxed text-body">{product.shortDescription}</p>

          {product.variants.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow text-muted">Options</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <li
                    key={v.name}
                    className={cn(
                      "border px-3 py-2 text-sm",
                      v.available ? "border-ink/25" : "border-line text-muted line-through decoration-1",
                    )}
                  >
                    {v.name}
                    {!v.available && <span className="sr-only"> (sold out)</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">Choose your option on {site.retailer.host}.</p>
            </div>
          )}

          {local ? (
            <>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row" id="buy-cta">
                <a
                  href={buyHref}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-14 items-center sm:flex-1 justify-center gap-2 bg-brand-deep px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink"
                >
                  {product.inStock ? `Buy now on ${site.retailer.name}` : `View on ${site.retailer.name}`}
                  <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <WishlistButton slug={product.slug} name={product.name} variant="full" className="h-14" />
              </div>
              <p className="mt-3 text-sm text-muted">
                You&apos;ll complete your purchase securely on {site.retailer.host}. Prices and stock are set by {site.retailer.name}.
              </p>
            </>
          ) : (
            <>
              <div className="mt-8">
                <WishlistButton slug={product.slug} name={product.name} variant="full" className="h-14" />
              </div>
              <p className="mt-3 text-sm text-muted">
                {arriving
                  ? `Part of our latest order from Diadem and coming soon to ${site.retailer.name} stores in Sri Lanka. Save it to your wishlist, or `
                  : `Part of Diadem's global range — not currently stocked by ${site.retailer.name} in Sri Lanka. Save it to your wishlist, or `}
                <Link href="/contact" className="font-semibold text-brand-deep underline-offset-2 hover:underline">
                  ask the store
                </Link>{" "}
                about it.
              </p>
            </>
          )}

          {tech.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow text-muted">Technology inside</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {tech.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/technologies#${t.slug}`}
                      className="group block border border-line p-4 transition-colors hover:border-brand-deep"
                    >
                      <span className="font-display block text-xl group-hover:text-brand-deep">{t.name}</span>
                      <span className="mt-1 block text-sm text-body">{t.short}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {local && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow text-muted">Try it in store</p>
              <ul className="mt-4 space-y-3">
                {site.retailer.stores.map((s) => (
                  <li key={s.name} className="flex gap-2 text-sm">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-deep" />
                    <span>
                      <span className="font-semibold">{s.name}</span> — {s.address}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-mist py-16 lg:py-24" aria-labelledby="details-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow index={1}>Details</Eyebrow>
            <h2 id="details-title" className="font-display mt-4 text-4xl sm:text-5xl">
              About the {product.type.toLowerCase() === "paddles" ? "paddle" : "product"}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-body">
              {product.description
                .filter((d) => d !== product.shortDescription)
                .map((d) => (
                  <p key={d.slice(0, 40)}>{d}</p>
                ))}
            </div>
            {product.features.length > 0 && (
              <>
                <h3 className="eyebrow mt-10 text-muted">Key features</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-deep" />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
          <Reveal className="lg:col-span-5">
            {specs.length > 0 && (
              <>
                <h3 className="eyebrow text-muted">Specifications</h3>
                <dl className="mt-4 divide-y divide-line border-y border-line bg-white">
                  {specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="font-semibold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-muted">Specifications as listed by {local ? site.retailer.name : "Diadem"}.</p>
              </>
            )}
            {product.included.length > 0 && (
              <>
                <h3 className="eyebrow mt-8 text-muted">What&apos;s included</h3>
                <ul className="mt-3 space-y-1 text-sm">
                  {product.included.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            )}
            {product.idealFor.length > 0 && (
              <>
                <h3 className="eyebrow mt-8 text-muted">Ideal for</h3>
                {product.idealFor.length === 1 ? (
                  <p className="mt-3 text-sm leading-relaxed">{product.idealFor[0]}</p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.idealFor.map((i) => (
                      <li key={i} className="border border-line bg-white px-3 py-1.5 text-sm">
                        {i}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Reveal>
        </div>
      </section>

      {complementary.length > 0 && <ProductRow index={2} eyebrow="Complete your set-up" title="Goes well with" products={complementary} />}
      {related.length > 0 && <ProductRow index={3} eyebrow="More like this" title="You may also like" products={related} border />}

      {local && (
        <BuyBar
          href={buyHref}
          name={product.name}
          price={product.price}
          image={product.images[0]?.src}
          retailerName={site.retailer.name}
          inStock={product.inStock}
          targetId="buy-cta"
        />
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          image: product.images.map((i) => i.src),
          sku: product.specs.find((s) => /code/i.test(s.label))?.value ?? product.retailerHandle,
          brand: { "@type": "Brand", name: "Diadem" },
          category: category?.name,
          url: absoluteUrl(`/products/${product.slug}`),
          offers: local
            ? {
                "@type": "Offer",
                url: product.retailerUrl,
                priceCurrency: "LKR",
                price: product.price.toFixed(2),
                availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: {
                  "@type": "Organization",
                  name: site.retailer.legalName,
                  url: site.retailer.url,
                },
              }
            : undefined,
        }}
      />
    </>
  );
}

function ProductRow({
  index,
  eyebrow,
  title,
  products,
  border,
}: {
  index: number;
  eyebrow: string;
  title: string;
  products: Awaited<ReturnType<typeof getRelatedProducts>>;
  border?: boolean;
}) {
  return (
    <section className={cn("py-16 lg:py-24", border && "border-t border-line")}>
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} index={index} title={title} />
        <Stagger className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} data-stagger>
              <ProductCard product={p} />
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

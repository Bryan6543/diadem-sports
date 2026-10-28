import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { CollectionHero } from "@/components/product/collection-hero";
import { ProductBrowser } from "@/components/product/product-browser";
import { getCategories, getCategory } from "@/lib/catalog";
import { parseQuery } from "@/lib/product-query";
import { getProductsByCategory } from "@/lib/products";
import { getSiteImageOverride } from "@/lib/site-images";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return { title: "Collection not found" };
  return { title: `Diadem ${c.name}`, description: c.description, alternates: { canonical: `/category/${c.slug}` } };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const [sp, products, banner] = await Promise.all([searchParams, getProductsByCategory(slug), getSiteImageOverride(`collection.${slug}`)]);
  const query = parseQuery(sp, slug);

  return (
    <>
      <CollectionHero
        eyebrow={category.comingSoon ? "Coming soon" : `${products.length} product${products.length === 1 ? "" : "s"} · ${category.tagline}`}
        title={category.name}
        intro={category.description}
        outline={category.shortName}
        background={banner}
        image={category.banner}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: category.name, href: `/category/${category.slug}` },
        ]}
      >
        {category.types.length > 1 && (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${category.name} types`}>
            <li>
              <Link
                href={`/category/${slug}`}
                className={`inline-block border px-4 py-2 text-sm font-semibold ${!query.type ? "border-white bg-white text-ink" : "border-white/30 hover:border-white"}`}
              >
                All
              </Link>
            </li>
            {category.types.map((t) => (
              <li key={t}>
                <Link
                  href={`/category/${slug}?type=${encodeURIComponent(t)}`}
                  className={`inline-block border px-4 py-2 text-sm font-semibold ${query.type === t ? "border-white bg-white text-ink" : "border-white/30 hover:border-white"}`}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollectionHero>

      <div className="container-x py-10 lg:py-14">
        {products.length ? (
          <ProductBrowser products={products} query={query} basePath={`/category/${slug}`} fixedCategory />
        ) : (
          <div className="mx-auto max-w-xl py-16 text-center">
            <p className="eyebrow text-brand-deep">Not in stock yet</p>
            <h2 className="font-display mt-4 text-5xl">Be first to know</h2>
            <p className="mt-4 text-body">
              Diadem {category.name.toLowerCase()} aren&apos;t stocked in Sri Lanka yet. Leave your email and we&apos;ll tell you the moment they
              arrive.
            </p>
            <NewsletterForm source={`waitlist-${slug}`} className="mx-auto mt-8 max-w-md text-left" />
            <Link href="/products" className="mt-8 inline-block font-semibold text-brand-deep underline underline-offset-4">
              Browse what&apos;s available now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

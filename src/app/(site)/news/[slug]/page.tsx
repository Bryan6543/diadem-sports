import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { Reveal, SplitReveal, Stagger } from "@/animations/motion";
import { ProductCard } from "@/components/product/product-card";
import { ArticleCard } from "@/components/ui/cards";
import { Breadcrumbs, JsonLd } from "@/components/ui/json-ld";
import { ShareButtons } from "@/components/ui/share-buttons";
import { site } from "@/data/site";
import { articleReadingTime, getArticle, getArticles } from "@/lib/catalog";
import { getProductsBySlugs } from "@/lib/products";
import { getSiteImage } from "@/lib/site-images";
import type { ArticleBlock } from "@/lib/types";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const revalidate = 3600;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Story not found" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/news/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const cover = (await getSiteImage(`story.${article.slug}`)) ?? article.cover;
  const minutes = articleReadingTime(article);
  const url = absoluteUrl(`/news/${article.slug}`);
  const related = await Promise.all(
    getArticles()
      .filter((a) => a.slug !== article.slug)
      .slice(0, 3)
      .map(async (a) => ({ article: a, cover: (await getSiteImage(`story.${a.slug}`)) ?? a.cover, minutes: articleReadingTime(a) })),
  );

  return (
    <article>
      <header className="container-x max-w-5xl pt-10 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: "Stories", href: "/news" },
            { label: article.title, href: `/news/${article.slug}` },
          ]}
        />
        <p className="eyebrow mt-10 text-brand-deep">
          {article.category} <span className="text-muted">· {minutes} min read</span>
        </p>
        <SplitReveal as="h1" immediate className="font-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
          {article.title}
        </SplitReveal>
        <p className="mt-6 text-xl leading-relaxed text-body">{article.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <p className="text-sm text-muted">
            By {article.author} · <time dateTime={article.date}>{formatDate(article.date)}</time>
          </p>
          <ShareButtons url={url} title={article.title} />
        </div>
      </header>

      <Reveal immediate className="container-x mt-10 max-w-6xl">
        <div className="relative aspect-[16/8] overflow-hidden bg-ink">
          <Image src={cover.src} alt={cover.alt} fill preload sizes="(min-width: 1280px) 72rem, 100vw" className="object-cover" />
        </div>
      </Reveal>

      <div className="container-x max-w-3xl py-14 lg:py-20">
        <div className="space-y-6 text-lg leading-relaxed text-body">
          {article.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
        {article.sources.length > 0 && (
          <div className="mt-14 border-t border-line pt-6">
            <p className="eyebrow text-muted">Sources</p>
            <ul className="mt-3 space-y-1 text-sm">
              {article.sources.map((s) => (
                <li key={s}>
                  <a href={s} target="_blank" rel="noopener" className="break-all text-brand-deep underline underline-offset-4">
                    {s.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-16 lg:py-24" aria-labelledby="related-title">
          <div className="container-x">
            <h2 id="related-title" className="font-display text-5xl">
              More stories
            </h2>
            <Stagger className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((r) => (
                <div key={r.article.slug} data-stagger>
                  <ArticleCard {...r} />
                </div>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          author: { "@type": "Organization", name: site.retailer.legalName },
          publisher: { "@type": "Organization", name: site.retailer.legalName, url: site.url },
          image: [cover.src.startsWith("/") ? absoluteUrl(cover.src) : cover.src],
          mainEntityOfPage: url,
        }}
      />
    </article>
  );
}

async function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "heading":
      return <h2 className="font-display !mt-12 text-4xl text-ink">{block.text}</h2>;
    case "list":
      return (
        <ul className="list-none space-y-2">
          {block.items.map((i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-3 size-1.5 shrink-0 rotate-45 bg-brand-deep" />
              {i}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <figure className="!my-12 border-l-4 border-brand-deep pl-6">
          <blockquote className="font-display text-4xl leading-[1.05] text-ink">&ldquo;{block.text}&rdquo;</blockquote>
          <figcaption className="eyebrow mt-4 text-muted">— {block.cite}</figcaption>
        </figure>
      );
    case "callout":
      return (
        <aside className="flex gap-4 bg-brand-wash p-6 text-base">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-deep" />
          <div>
            <p className="font-semibold text-ink">{block.title}</p>
            <p className="mt-1">{block.text}</p>
          </div>
        </aside>
      );
    case "products": {
      const products = await getProductsBySlugs(block.slugs);
      if (!products.length) return null;
      return (
        <div className="!my-12 not-prose border-y border-line py-8">
          {block.title && <p className="eyebrow mb-6 text-brand-deep">{block.title}</p>}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      );
    }
  }
}

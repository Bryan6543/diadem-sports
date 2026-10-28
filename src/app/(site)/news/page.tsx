import type { Metadata } from "next";
import { Stagger } from "@/animations/motion";
import { CollectionHero } from "@/components/product/collection-hero";
import { ArticleCard } from "@/components/ui/cards";
import { articleReadingTime, getArticles } from "@/lib/catalog";
import { getSiteImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Stories",
  description: "News, launches and buying guides for Diadem tennis and pickleball in Sri Lanka.",
  alternates: { canonical: "/news" },
};

export const revalidate = 3600;

export default async function NewsPage() {
  const stories = await Promise.all(
    getArticles().map(async (a) => ({ article: a, cover: (await getSiteImage(`story.${a.slug}`)) ?? a.cover, minutes: articleReadingTime(a) })),
  );
  const [lead, ...rest] = stories;
  return (
    <>
      <CollectionHero
        eyebrow="Stories"
        title="From the court"
        intro="Launches, Team Diadem news and plain-language buying guides."
        outline="Stories"
        image={{ src: "/images/brand/bublik-court.jpg", alt: "Alexander Bublik on court holding a Diadem racket" }}
        crumbs={[{ label: "Stories", href: "/news" }]}
      />
      <div className="container-x py-14 lg:py-20">
        {lead && <ArticleCard {...lead} large className="lg:w-3/4" />}
        <Stagger className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <div key={s.article.slug} data-stagger>
              <ArticleCard {...s} />
            </div>
          ))}
        </Stagger>
      </div>
    </>
  );
}

import { ArrowRight } from "lucide-react";
import { ArrivingSoon } from "@/components/home/arriving-soon";
import { CategoryBento } from "@/components/home/category-bento";
import { Carousel } from "@/components/home/featured-carousel";
import { Hero, type ResolvedSlide } from "@/components/home/hero";
import { RacketShowcase } from "@/components/home/racket-showcase";
import { Marquee } from "@/components/home/marquee";
import {
  AthletesStrip,
  BrandStory,
  LatestStories,
  RetailerBanner,
  SponsorshipSection,
  TechShowcase,
} from "@/components/home/sections";
import { Spotlight } from "@/components/home/spotlight";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";
import { heroSlides } from "@/data/hero-slides";
import { site } from "@/data/site";
import {
  articleReadingTime,
  getAcademies,
  getArticles,
  availableInCategory,
  categoryTilePhoto,
  getAthletes,
  getCategories,
  getArrivingSoon,
  getFeaturedSponsoredPlayer,
  getTechnologies,
} from "@/lib/catalog";
import { getFeaturedProducts, getProducts, getSpotlightProducts } from "@/lib/products";
import { getSiteImage, getSiteImageOverride } from "@/lib/site-images";
import { formatPrice, isSoldLocally, withReferral } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  const [products, featured, spotlights] = await Promise.all([getProducts(), getFeaturedProducts(8), getSpotlightProducts()]);

  const slides: ResolvedSlide[] = await Promise.all(
    heroSlides.map(async (s) => {
      const override = await getSiteImageOverride(`home.slide.${s.id}`);
      const product = s.productSlug ? products.find((p) => p.slug === s.productSlug) : undefined;
      const local = product && isSoldLocally(product) && product.inStock;
      return {
        ...s,
        image: override ?? s.image,
        position: override ? "center" : s.position,
        price: local ? formatPrice(product.price) : undefined,
        buyHref: local ? withReferral(product.retailerUrl, `hero-${s.id}`, "hero") : undefined,
      };
    }),
  );

  const rackets = availableInCategory("tennis-rackets", products);
  const racketTotal = products.filter((p) => p.category === "tennis-rackets").length;

  const tiles = await Promise.all(
    getCategories().map(async (c) => ({
      category: c,
      count: availableInCategory(c.slug, products).length,
      photo: await getSiteImageOverride(`category.${c.slug}`),
      product: categoryTilePhoto(c, products),
    })),
  );

  const stories = await Promise.all(
    getArticles()
      .slice(0, 3)
      .map(async (a) => ({ article: a, cover: (await getSiteImage(`story.${a.slug}`)) ?? a.cover, minutes: articleReadingTime(a) })),
  );

  const athletes = await Promise.all(
    getAthletes().map(async (a) => ({
      athlete: a,
      portrait: (await getSiteImage(`athlete.${a.slug}`)) ?? a.photo,
    })),
  );

  const player = getFeaturedSponsoredPlayer();
  const [academy] = getAcademies();
  // Tennis rackets lead the spotlights.
  const [first, second] = [...spotlights].sort(
    (a, b) => Number(b.category === "tennis-rackets") - Number(a.category === "tennis-rackets"),
  );

  return (
    <>
      <Hero slides={slides} retailerName={site.retailer.name} />
      <ArrivingSoon items={getArrivingSoon(products)} index={1} />
      <RacketShowcase rackets={rackets} total={racketTotal} index={2} />
      <Marquee items={site.marquee} className="text-ink" />

      <section className="py-20 lg:py-28" aria-labelledby="collections-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Collections"
              index={3}
              title={<span id="collections-title">Find your game</span>}
              intro="Tennis or pickleball, power or control — every Diadem collection stocked in Sri Lanka."
            />
            <ButtonLink href="/products" variant="outline">
              All products <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-12">
            <CategoryBento tiles={tiles} />
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20 lg:py-28" aria-labelledby="featured-title">
        <div className="container-x">
          <SectionHeading eyebrow="Featured" index={4} title={<span id="featured-title">Players&apos; picks</span>} />
          <div className="mt-8">
            <Carousel label="Featured products">
              {featured.map((p, i) => (
                <li key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[19rem]">
                  <ProductCard product={p} priority={i < 2} />
                </li>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {first && <Spotlight product={first} index={4} />}
      {second && (
        <div className="bg-mist">
          <Spotlight product={second} index={4} flip />
        </div>
      )}

      <LatestStories stories={stories} />
      <TechShowcase technologies={getTechnologies().slice(0, 6)} />
      <BrandStory />
      {academy && player && (
        <SponsorshipSection
          academy={academy}
          player={player}
          playerPortrait={(await getSiteImage(`sponsorship.${player.slug}`)) ?? player.portrait}
        />
      )}
      <AthletesStrip athletes={athletes} />
      <RetailerBanner logo={await getSiteImageOverride("retailer.logo")} />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger } from "@/animations/motion";
import type { TilePhoto } from "@/lib/catalog";
import type { Category, ImageRef } from "@/lib/types";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export interface BentoTile {
  category: Category;
  /** Products available at the retailer in this category. */
  count: number;
  /** Admin-uploaded tile photo (fills the tile). */
  photo: ImageRef | null;
  /** Photo of an in-stock retailer product (the default). */
  product: TilePhoto | null;
}

/**
 * Tennis rackets get the large tile; every other collection gets a small one.
 * Only collections with a product available at the retailer are shown.
 */
export function CategoryBento({ tiles }: { tiles: BentoTile[] }) {
  const order = ["tennis-rackets", "strings", "pickleball", "shoes-apparel", "accessories", "bags"];
  const sorted = order
    .map((s) => tiles.find((t) => t.category.slug === s))
    .filter((t): t is BentoTile => Boolean(t && (t.photo || t.product)));
  return (
    <Stagger className="grid auto-rows-[16rem] grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[18rem]">
      {sorted.map(({ category: c, count, photo, product }) => {
        const large = c.slug === "tennis-rackets";
        const img = photo ?? product!;
        const cover = photo ? true : product!.fit === "cover";
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            data-stagger
            className={cn(
              "group relative isolate flex flex-col justify-end overflow-hidden p-6",
              cover ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line",
              large && "row-span-2 sm:col-span-2",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"}
              className={cn(
                "-z-20 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105",
                cover ? "object-cover" : "object-contain px-4 pb-24 pt-2",
              )}
            />
            {cover && <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/0" />}
            <span className="flex items-end justify-between gap-4">
              <span>
                <span className={cn("eyebrow block", cover ? "text-brand-bright" : "text-brand-deep")}>
                  {count} in stock at {site.retailer.name}
                </span>
                <span className={cn("font-display mt-2 block", large ? "text-6xl lg:text-8xl" : "text-4xl")}>{c.name}</span>
                {large && <span className="mt-3 block max-w-sm text-white/80">{c.tagline}</span>}
              </span>
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center border transition-colors",
                  cover
                    ? "border-white/40 group-hover:border-white group-hover:bg-white group-hover:text-ink"
                    : "border-ink/20 group-hover:border-ink group-hover:bg-ink group-hover:text-white",
                )}
              >
                <ArrowUpRight aria-hidden className="size-5" />
              </span>
            </span>
          </Link>
        );
      })}
    </Stagger>
  );
}

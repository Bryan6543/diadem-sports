import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { getCategory, isArrivingSoon } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn, isSoldLocally } from "@/lib/utils";
import { Price } from "./price";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const [img, alt] = product.images;
  const local = isSoldLocally(product);
  const arriving = isArrivingSoon(product);
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        {img ? (
          <>
            <Image
              src={img.src}
              alt={img.alt || product.name}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
              loading={priority ? "eager" : "lazy"}
              className={cn(
                "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]",
                alt && "group-hover:opacity-0",
              )}
            />
            {alt && (
              <Image
                src={alt.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <Image
            src={getCategory(product.category)?.banner.src ?? "/images/brand/rackets-fence.jpg"}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
            className="object-cover"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {arriving && (
            <span className="eyebrow bg-brand-bright px-2 py-1 !text-[0.6rem] font-bold text-ink">
              {local ? "New stock arriving" : "Arriving soon"}
            </span>
          )}
          {local && !product.inStock && <span className="eyebrow bg-ink px-2 py-1 !text-[0.6rem] text-white">Sold out</span>}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="eyebrow bg-accent px-2 py-1 !text-[0.6rem] font-bold text-ink">Sale</span>
          )}
        </div>
        <WishlistButton slug={product.slug} name={product.name} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow text-muted">{product.type}</p>
        <h3 className="mt-1.5 text-[0.95rem] font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-brand-deep">
            {product.name}
          </Link>
        </h3>
        {local ? (
          <Price price={product.price} compareAt={product.compareAtPrice} className="mt-auto pt-3" size="sm" />
        ) : (
          <p className={cn("mt-auto pt-3 text-xs", arriving ? "font-semibold text-brand-deep" : "text-muted")}>
            {arriving ? `Arriving soon at ${site.retailer.name}` : "Diadem global range"}
          </p>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton mt-4 h-3 w-1/3" />
      <div className="skeleton mt-2 h-4 w-4/5" />
      <div className="skeleton mt-4 h-4 w-1/4" />
    </div>
  );
}

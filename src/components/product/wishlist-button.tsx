"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

export function WishlistButton({
  slug,
  name,
  className,
  variant = "icon",
}: {
  slug: string;
  name: string;
  className?: string;
  variant?: "icon" | "full";
}) {
  const { has, toggle } = useWishlist();
  const saved = has(slug);
  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-13 items-center justify-center gap-2 border px-5 text-[0.8rem] font-bold uppercase tracking-[0.12em] transition-colors",
          saved ? "border-brand-deep bg-brand-wash text-brand-deep" : "border-ink/25 text-ink hover:border-ink",
          className,
        )}
      >
        <Heart aria-hidden className={cn("size-4", saved && "fill-current")} />
        {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        "grid size-10 place-items-center bg-white/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-white",
        saved && "text-brand-deep",
        className,
      )}
    >
      <Heart aria-hidden className={cn("size-[1.1rem]", saved && "fill-current")} />
    </button>
  );
}

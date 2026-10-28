"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

/** Sticky mobile buy bar that appears once the main Buy button scrolls out of view. */
export function BuyBar({
  href,
  name,
  price,
  image,
  retailerName,
  inStock,
  targetId,
}: {
  href: string;
  name: string;
  price: number;
  image?: string;
  retailerName: string;
  inStock: boolean;
  targetId: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-500 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="container-x flex items-center gap-3 py-3">
        {image && (
          <span className="relative size-12 shrink-0 overflow-hidden bg-mist">
            <Image src={image} alt="" fill sizes="48px" className="object-cover" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="font-mono text-sm">{formatPrice(price)}</span>
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 shrink-0 items-center gap-1.5 bg-brand-deep px-4 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white"
        >
          {inStock ? "Buy now" : "View"}
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">on {retailerName} (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

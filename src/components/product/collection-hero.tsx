import Image from "next/image";
import type { ReactNode } from "react";
import { SplitReveal, Reveal } from "@/animations/motion";
import { Breadcrumbs, type Crumb } from "@/components/ui/json-ld";
import type { ImageRef } from "@/lib/types";

const DEFAULT_IMAGE: ImageRef = { src: "/images/brand/tennis-at-net.jpg", alt: "Two players meeting at the net with Diadem rackets" };

/**
 * Dark page banner. Shows the admin-set photo if there is one, otherwise the page's default photo
 * (`image`), otherwise a general Diadem tennis photo — never an empty block.
 */
export function CollectionHero({
  eyebrow,
  title,
  intro,
  outline,
  background,
  image,
  position,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  outline?: string;
  /** Admin override (site images). */
  background?: ImageRef | null;
  /** Default photo for this page. */
  image?: ImageRef;
  /** CSS object-position for the default photo. */
  position?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  const photo = background ?? image ?? DEFAULT_IMAGE;
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        preload
        sizes="100vw"
        style={{ objectPosition: background ? "center" : (position ?? "center") }}
        className="-z-20 object-cover"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
      {outline && (
        <span
          aria-hidden
          className="font-display hollow pointer-events-none absolute -bottom-6 right-0 select-none whitespace-nowrap text-[clamp(6rem,18vw,16rem)] leading-none text-white/15"
        >
          {outline}
        </span>
      )}
      <div className="container-x relative py-14 lg:py-20">
        <Breadcrumbs items={crumbs} tone="light" />
        <p className="eyebrow mt-10 text-brand-bright">{eyebrow}</p>
        <SplitReveal as="h1" immediate className="font-display mt-4 max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
          {title}
        </SplitReveal>
        {intro && (
          <Reveal immediate delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

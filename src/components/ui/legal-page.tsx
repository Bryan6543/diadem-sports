import type { ReactNode } from "react";
import { CollectionHero } from "@/components/product/collection-hero";

export function LegalPage({ title, updated, href, children }: { title: string; updated: string; href: string; children: ReactNode }) {
  return (
    <>
      <CollectionHero eyebrow={`Last updated ${updated}`} title={title} image={{ src: "/images/brand/tennis-balls-court.jpg", alt: "Diadem Premier tennis balls on court" }} crumbs={[{ label: title, href }]} />
      <div className="container-x max-w-3xl py-14 lg:py-20">
        <div className="space-y-5 leading-relaxed text-body [&_a]:text-brand-deep [&_a]:underline [&_h2]:font-display [&_h2]:!mt-12 [&_h2]:text-3xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </>
  );
}

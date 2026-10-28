import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcademyView } from "@/components/sponsorship/academy-view";
import { PlayerView } from "@/components/sponsorship/player-view";
import { getAcademies, getSponsorship, getSponsorships } from "@/lib/catalog";
import { getProductsBySlugs } from "@/lib/products";

export const revalidate = 3600;

export function generateStaticParams() {
  return getSponsorships().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSponsorship(slug);
  if (!s) return { title: "Not found" };
  return {
    title: s.kind === "academy" ? `${s.name} — partner academy` : `${s.name} — sponsored junior`,
    description: s.tagline,
    alternates: { canonical: `/sponsorship/${s.slug}` },
    // Sample pages should not be indexed until real content replaces them.
    robots: s.isSample ? { index: false, follow: true } : undefined,
  };
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSponsorship(slug);
  if (!s) notFound();
  if (s.kind === "academy") return <AcademyView academy={s} />;

  const products = await getProductsBySlugs(s.kit.map((k) => k.productSlug).filter((x): x is string => Boolean(x)));
  const kit = s.kit.map((k) => products.find((p) => p.slug === k.productSlug) ?? null);
  const academy = getAcademies().find((a) => a.slug === s.academySlug);
  return <PlayerView player={s} academy={academy} kit={kit} />;
}

import type { Metadata } from "next";
import { CollectionHero } from "@/components/product/collection-hero";
import { findByToken } from "@/lib/server/newsletter";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = { title: "Email preferences", robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string; done?: string }> }) {
  const { token = "", done } = await searchParams;
  const sub = token ? await findByToken(token) : null;
  return (
    <>
      <CollectionHero eyebrow="Newsletter" title="Email preferences" image={{ src: "/images/brand/tennis-balls-court.jpg", alt: "Diadem Premier tennis balls on court" }} crumbs={[{ label: "Email preferences", href: "/unsubscribe" }]} />
      <div className="container-x max-w-xl py-14 lg:py-20">
        {!sub ? (
          <p className="text-body">
            This link is invalid or has expired. To unsubscribe, use the link at the bottom of any of our emails, or contact us.
          </p>
        ) : (
          <UnsubscribeForm token={token} email={sub.email} active={sub.status === "active" && done !== "1"} />
        )}
      </div>
    </>
  );
}

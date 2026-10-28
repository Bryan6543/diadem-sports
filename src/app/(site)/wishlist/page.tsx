import type { Metadata } from "next";
import { CollectionHero } from "@/components/product/collection-hero";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Diadem products.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <CollectionHero
        eyebrow="Saved on this device"
        title="Your wishlist"
        intro="Products you've saved. Your list stays in this browser and syncs across open tabs."
        image={{ src: "/images/brand/rackets-fence.jpg", alt: "A line-up of Diadem tennis rackets against a court fence" }}
        position="50% 30%"
        crumbs={[{ label: "Wishlist", href: "/wishlist" }]}
      />
      <div className="container-x py-12 lg:py-16">
        <WishlistView />
      </div>
    </>
  );
}

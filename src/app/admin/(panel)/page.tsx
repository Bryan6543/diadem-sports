import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { seedProducts } from "@/data/products";
import { siteImageSlots } from "@/data/site-image-slots";
import { requireAdmin } from "@/lib/server/admin-auth";
import { dbListProducts } from "@/lib/server/products-db";
import { getSupabase } from "@/lib/server/supabase";
import { dbListSiteImages } from "@/lib/site-images";
import { isSoldLocally } from "@/lib/utils";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await requireAdmin();
  const db = getSupabase();
  const [products, images, subs] = await Promise.all([
    dbListProducts().catch(() => null),
    dbListSiteImages().catch(() => []),
    db ? db.from("subscribers").select("id", { count: "exact", head: true }).eq("status", "active") : null,
  ]);
  const list = products ?? seedProducts;
  const cards = [
    { label: "Products", value: list.length, sub: `${list.filter((p) => p.published).length} published · ${list.filter((p) => isSoldLocally(p) && !p.inStock).length} sold out · ${list.filter((p) => !isSoldLocally(p)).length} information pages`, href: "/admin/products" },
    { label: "Custom site images", value: images.length, sub: `of ${siteImageSlots.length} slots`, href: "/admin/site-images" },
    { label: "Active subscribers", value: subs?.count ?? "—", sub: db ? "Newsletter" : "Database not connected", href: "/admin/subscribers" },
  ];
  return (
    <>
      <h1 className="font-display text-5xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group bg-white p-6 hover:outline hover:outline-ink">
            <p className="eyebrow text-muted">{c.label}</p>
            <p className="font-display mt-3 text-6xl">{c.value}</p>
            <p className="mt-2 flex items-center justify-between text-sm text-muted">
              {c.sub} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-10 bg-white p-6">
        <h2 className="text-lg font-semibold">Quick guide</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-body">
          <li>
            <strong>Products</strong> — edit names, prices, specs and photos. Use <em>Sync all photos</em> to pull the latest photos, prices and
            stock from unitedsports.lk.
          </li>
          <li>
            <strong>Site images</strong> — replace the logo, home hero, category tiles, collection banners, athlete portraits and story covers.
          </li>
          <li>
            <strong>Subscribers</strong> — see and export newsletter sign-ups.
          </li>
          <li>Changes go live immediately after you save.</li>
        </ul>
      </div>
    </>
  );
}

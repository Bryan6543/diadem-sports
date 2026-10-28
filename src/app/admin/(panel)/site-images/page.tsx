import { siteImageSlots, slotGroups } from "@/data/site-image-slots";
import { requireAdmin } from "@/lib/server/admin-auth";
import { hasSupabase } from "@/lib/server/env";
import { dbListSiteImages } from "@/lib/site-images";
import { SiteImageCard } from "./site-image-card";

export const metadata = { title: "Site images" };
export const dynamic = "force-dynamic";

export default async function SiteImagesPage() {
  await requireAdmin();
  const overrides = await dbListSiteImages().catch(() => []);
  const byKey = new Map(overrides.map((o) => [o.key, o]));
  const enabled = hasSupabase();

  return (
    <>
      <h1 className="font-display text-5xl">Site images</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Replace any picture on the site. Uploads are resized automatically and location data is removed. &ldquo;Reset&rdquo; brings back the
        original artwork.
      </p>

      <nav aria-label="Image sections" className="sticky top-14 z-30 -mx-4 mt-6 border-b border-line bg-mist/95 px-4 py-3 backdrop-blur">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto">
          {slotGroups.map((g) => {
            const slots = siteImageSlots.filter((s) => s.group === g.id);
            const custom = slots.filter((s) => byKey.has(s.key)).length;
            return (
              <li key={g.id} className="shrink-0">
                <a href={`#group-${g.id}`} className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-1.5 text-sm hover:border-ink">
                  {g.label}
                  <span className="font-mono text-xs text-muted">
                    {custom}/{slots.length}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {slotGroups.map((g) => (
        <section key={g.id} id={`group-${g.id}`} className="scroll-mt-32 pt-10" aria-labelledby={`h-${g.id}`}>
          <h2 id={`h-${g.id}`} className="text-xl font-semibold">
            {g.label}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {siteImageSlots
              .filter((s) => s.group === g.id)
              .map((slot) => {
                const o = byKey.get(slot.key);
                return (
                  <SiteImageCard
                    key={slot.key}
                    slot={slot}
                    current={o ? { src: o.src, alt: o.alt } : null}
                    enabled={enabled}
                  />
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}

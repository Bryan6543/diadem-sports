import "server-only";
import { unstable_cache } from "next/cache";
import { slotByKey } from "@/data/site-image-slots";
import { getSupabase } from "./server/supabase";
import type { ImageRef } from "./types";

export const SITE_IMAGES_TAG = "site-images";

export interface SiteImageOverride {
  key: string;
  src: string;
  alt: string;
  updated_at?: string;
}

export async function dbListSiteImages(): Promise<SiteImageOverride[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db.from("site_images").select("key, src, alt, updated_at");
  if (error) throw new Error(error.message);
  return (data ?? []) as SiteImageOverride[];
}

const loadOverrides = unstable_cache(
  async (): Promise<Record<string, ImageRef>> => {
    try {
      const rows = await dbListSiteImages();
      return Object.fromEntries(rows.filter((r) => r.src).map((r) => [r.key, { src: r.src, alt: r.alt }]));
    } catch (err) {
      console.error("[site-images] database unavailable:", (err as Error).message);
      return {};
    }
  },
  ["site-images-v1"],
  { tags: [SITE_IMAGES_TAG], revalidate: 3600 },
);

export async function getSiteImageOverrides() {
  return loadOverrides();
}

/** Admin override if present, otherwise the bundled default (or null when the slot has none). */
export async function getSiteImage(key: string): Promise<(ImageRef & { custom: boolean }) | null> {
  const overrides = await loadOverrides();
  const o = overrides[key];
  if (o) return { ...o, custom: true };
  const slot = slotByKey.get(key);
  if (slot?.defaultSrc) return { src: slot.defaultSrc, alt: slot.defaultAlt, custom: false };
  return null;
}

/** Only the admin override (null if not set) — for slots where the default is built-in artwork. */
export async function getSiteImageOverride(key: string): Promise<ImageRef | null> {
  const overrides = await loadOverrides();
  return overrides[key] ?? null;
}

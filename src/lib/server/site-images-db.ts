import "server-only";
import { getSupabase } from "./supabase";

export async function dbUpsertSiteImage(key: string, src: string, alt: string) {
  const db = getSupabase();
  if (!db) throw new Error("Database is not configured.");
  const { error } = await db
    .from("site_images")
    .upsert({ key, src, alt, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

export async function dbDeleteSiteImage(key: string) {
  const db = getSupabase();
  if (!db) throw new Error("Database is not configured.");
  const { error } = await db.from("site_images").delete().eq("key", key);
  if (error) throw new Error(error.message);
}

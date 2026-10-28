import "server-only";
import { getSupabase } from "./supabase";

const memory = new Map<string, { count: number; reset: number }>();

function memoryHit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + windowSec * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/**
 * Returns true when the request is allowed. Uses the database (shared across serverless
 * instances) when configured, falling back to per-instance memory.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const db = getSupabase();
  if (db) {
    const { data, error } = await db.rpc("hit_rate_limit", { p_key: key, p_limit: limit, p_window_seconds: windowSec });
    if (!error && typeof data === "boolean") return data;
  }
  return memoryHit(key, limit, windowSec);
}

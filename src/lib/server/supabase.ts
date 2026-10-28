import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabase } from "./env";

let client: SupabaseClient | null = null;

/** Service-role client. Server only — every table has RLS on with no public policies. */
export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  client ??= createClient(env.supabaseUrl!, env.supabaseServiceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return client;
}

export const PRODUCT_BUCKET = "product-images";
export const SITE_BUCKET = "site-images";
